/**
 * Endercom Agent Functions - Node.js/TypeScript
 * Simple interface for creating agent functions with the new Endercom function-based model.
 */

import express, { Request, Response } from 'express';
import axios from 'axios';

export interface FunctionOptions {
    name: string;
    description?: string;
    capabilities?: string[];
    platformUrl?: string;
    autoRegister?: boolean;
    debug?: boolean;
}

export type FunctionHandler = (inputData: any) => any | Promise<any>;

/**
 * Simple agent function that exposes HTTP endpoints for the Endercom platform.
 */
export class AgentFunction {
    private name: string;
    private description: string;
    private capabilities: string[];
    private platformUrl: string;
    private autoRegister: boolean;
    private debug: boolean;

    private handler: FunctionHandler | null = null;
    private app: express.Application;
    private server: any = null;
    private functionId: string | null = null;
    private endpointUrl: string | null = null;

    constructor(options: FunctionOptions) {
        this.name = options.name;
        this.description = options.description || '';
        this.capabilities = options.capabilities || [];
        this.platformUrl = options.platformUrl || 'http://localhost:3000';
        this.autoRegister = options.autoRegister !== false; // Default true
        this.debug = options.debug || false;

        // Express app for HTTP server
        this.app = express();
        this.app.use(express.json());

        // Setup routes
        this.setupRoutes();

        // Graceful shutdown
        process.on('SIGINT', this.signalHandler.bind(this));
        process.on('SIGTERM', this.signalHandler.bind(this));
    }

    /**
     * Set the function handler.
     */
    setHandler(handler: FunctionHandler): void {
        this.handler = handler;
    }

    /**
     * Setup Express routes for the function endpoints.
     */
    private setupRoutes(): void {
        // Health check endpoint
        this.app.get('/health', (req: Request, res: Response) => {
            res.json({ status: 'ok', name: this.name });
        });

        // Function execution endpoint
        this.app.post('/execute', async (req: Request, res: Response) => {
            try {
                if (!this.handler) {
                    return res.status(500).json({
                        error: 'No handler defined for this function'
                    });
                }

                const inputData = req.body.input || req.body;
                if (this.debug) {
                    console.log('Executing function with input:', inputData);
                }

                // Execute the handler
                const result = await this.handler(inputData);

                if (this.debug) {
                    console.log('Function execution completed:', result);
                }

                res.json(result);

            } catch (error) {
                console.error('Function execution error:', (error as Error).message);
                res.status(500).json({
                    error: `Function execution failed: ${(error as Error).message}`
                });
            }
        });

        // Function information endpoint
        this.app.get('/info', (req: Request, res: Response) => {
            res.json({
                name: this.name,
                description: this.description,
                capabilities: this.capabilities,
                status: 'running'
            });
        });
    }

    /**
     * Register this function with the Endercom platform.
     */
    async registerWithPlatform(host: string = 'localhost', port: number = 3001): Promise<any> {
        if (!this.endpointUrl) {
            this.endpointUrl = `http://${host}:${port}/execute`;
        }

        const registrationData = {
            name: this.name,
            description: this.description,
            endpoint: this.endpointUrl,
            capabilities: this.capabilities
        };

        try {
            const response = await axios.post(
                `${this.platformUrl}/api/agent-functions`,
                registrationData,
                { timeout: 10000 }
            );

            if (response.status === 201 && response.data.success && response.data.data) {
                this.functionId = response.data.data.id;
                console.log(`Successfully registered function '${this.name}' with ID: ${this.functionId}`);
                return response.data;
            } else {
                throw new Error(`Registration failed: ${response.data.error || 'Unknown error'}`);
            }
        } catch (error: any) {
            console.error('Failed to register with platform:', error.message);
            throw new Error(`Platform registration failed: ${error.message}`);
        }
    }

    /**
     * Unregister this function from the Endercom platform.
     */
    async unregisterFromPlatform(): Promise<boolean> {
        if (!this.functionId) {
            console.warn('No function ID available, cannot unregister');
            return false;
        }

        try {
            const response = await axios.delete(
                `${this.platformUrl}/api/agent-functions/${this.functionId}`,
                { timeout: 10000 }
            );

            if (response.status === 200) {
                console.log(`Successfully unregistered function '${this.name}'`);
                return true;
            } else {
                console.error(`Failed to unregister: HTTP ${response.status}`);
                return false;
            }
        } catch (error: any) {
            console.error('Failed to unregister from platform:', error.message);
            return false;
        }
    }

    /**
     * Start the agent function server.
     */
    async run(port: number = 3001, host: string = 'localhost'): Promise<void> {
        if (!this.handler) {
            throw new Error('No handler defined. Use setHandler() first.');
        }

        // Auto-register if enabled
        if (this.autoRegister) {
            try {
                await this.registerWithPlatform(host, port);
            } catch (error: any) {
                console.warn('Auto-registration failed:', error.message);
                console.log('Function will still run, but won\'t be registered with platform');
            }
        }

        console.log(`Starting ${this.name} on ${host}:${port}`);
        console.log(`Health check: http://${host}:${port}/health`);
        console.log(`Execute endpoint: http://${host}:${port}/execute`);
        console.log(`Function info: http://${host}:${port}/info`);

        // Start Express server
        return new Promise((resolve) => {
            this.server = this.app.listen(port, host, () => {
                console.log(`Agent function '${this.name}' is running on port ${port}`);
                resolve();
            });
        });
    }

    /**
     * Stop the agent function server.
     */
    async stop(): Promise<void> {
        if (this.server) {
            this.server.close();
        }

        if (this.autoRegister && this.functionId) {
            try {
                await this.unregisterFromPlatform();
            } catch (error: any) {
                console.error('Failed to unregister during shutdown:', error.message);
            }
        }
    }

    /**
     * Handle graceful shutdown.
     */
    private async signalHandler(signal: string): Promise<void> {
        console.log(`\nShutting down agent function (${signal})...`);
        await this.stop();
        process.exit(0);
    }
}

/**
 * Convenience function for simple usage.
 */
export function createFunction(name: string, handler: FunctionHandler, options: Omit<FunctionOptions, 'name'> = {}): AgentFunction {
    const agentFunction = new AgentFunction({ name, ...options });
    agentFunction.setHandler(handler);
    return agentFunction;
}