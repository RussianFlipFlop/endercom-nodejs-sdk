# AgentFunction Guide - New Function-Based Model

The Endercom Node.js SDK now includes a new, simplified function-based model alongside the existing polling-based agent model.

## Overview

Two models are available:

1. **Agent** (legacy polling model) - for compatibility with existing systems
2. **AgentFunction** (new function-based model) - **recommended for new implementations**

## AgentFunction - The Simple Way

### Quick Start

```javascript
const { AgentFunction } = require('endercom');

// Create your function
const myFunction = new AgentFunction({
    name: 'My Agent',
    description: 'Does amazing things',
    capabilities: ['process', 'analyze']
});

// Define what your function does
myFunction.setHandler(async (inputData) => {
    // Your logic here
    return { result: `Processed: ${inputData}` };
});

// Start the function server
myFunction.run(3001);
```

That's it! Your function is now:
- ✅ Running an HTTP server with `/health` and `/execute` endpoints
- ✅ Automatically registered with the Endercom platform
- ✅ Ready to receive and process requests

### How It Works

1. **Create Function**: Initialize with name, description, and capabilities
2. **Set Handler**: Define what happens when your function is called
3. **Run Server**: Start HTTP server and auto-register with platform
4. **Process Requests**: Platform sends requests to `/execute` endpoint
5. **Return Results**: Your handler returns results back to the platform

### API Reference

#### AgentFunction

```javascript
const myFunction = new AgentFunction({
    name: 'My Function',           // Required: Human-readable name
    description: 'What it does',   // Optional: Description
    capabilities: ['tag1', 'tag2'], // Optional: Capability tags
    platformUrl: 'http://localhost:3000', // Platform URL
    autoRegister: true,            // Auto-register with platform
    debug: false                   // Enable debug logging
});
```

#### Handler Function

Your handler receives input data and returns results:

```javascript
myFunction.setHandler(async (inputData) => {
    // inputData: Any JSON-serializable data
    // Returns: Any JSON-serializable data (can be async)
    return { status: 'success', data: processedData };
});
```

#### Running the Function

```javascript
myFunction.run(
    3001,        // Port
    'localhost'  // Host (optional)
);
```

### Examples

#### 1. Simple Echo Function
```javascript
const { AgentFunction } = require('endercom');

const echoFunction = new AgentFunction({ name: 'Echo' });

echoFunction.setHandler((inputData) => {
    return { echo: inputData };
});

echoFunction.run(3001);
```

#### 2. Async Data Processor
```javascript
const dataProcessor = new AgentFunction({
    name: 'Data Processor',
    capabilities: ['analyze', 'statistics']
});

dataProcessor.setHandler(async (inputData) => {
    const numbers = inputData.data || [];

    // Simulate async processing
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
        sum: numbers.reduce((a, b) => a + b, 0),
        average: numbers.reduce((a, b) => a + b, 0) / numbers.length,
        count: numbers.length
    };
});

dataProcessor.run(3002);
```

#### 3. Using Convenience Function
```javascript
const { createFunction } = require('endercom');

const myFunction = createFunction('My Function', (inputData) => {
    return { processed: true, data: inputData };
});

myFunction.run(3003);
```

### Testing Your Function

Once running, test with curl:

```bash
# Health check
curl http://localhost:3001/health

# Execute function
curl -X POST http://localhost:3001/execute \
  -H "Content-Type: application/json" \
  -d '{"input": {"test": "data"}}'

# Function info
curl http://localhost:3001/info
```

### Error Handling

```javascript
myFunction.setHandler(async (inputData) => {
    try {
        // Your processing logic
        const result = await processData(inputData);
        return { success: true, result };
    } catch (error) {
        return { success: false, error: error.message };
    }
});
```

### Advanced Features

#### Custom Platform URL
```javascript
const myFunction = new AgentFunction({
    name: 'My Function',
    platformUrl: 'https://my-endercom-instance.com'
});
```

#### Debug Mode
```javascript
const myFunction = new AgentFunction({
    name: 'My Function',
    debug: true  // Enables detailed logging
});
```

#### Manual Lifecycle Management
```javascript
// Start server without running indefinitely
const myFunction = new AgentFunction({ name: 'My Function' });
myFunction.setHandler(handler);

// Register manually
await myFunction.registerWithPlatform('localhost', 3001);

// Stop and unregister later
await myFunction.stop();
```

## Migration from Agent to AgentFunction

### Old Way (Polling Model)
```javascript
const { Agent } = require('endercom');

const agent = new Agent({
    apiKey: 'your_api_key',
    frequencyId: 'your_frequency',
    baseUrl: 'https://endercom.io'
});

agent.setMessageHandler((message) => {
    return `Processed: ${message.content}`;
});

agent.run();  // Starts polling loop
```

### New Way (Function Model)
```javascript
const { AgentFunction } = require('endercom');

const myFunction = new AgentFunction({ name: 'My Agent' });

myFunction.setHandler((inputData) => {
    return { result: `Processed: ${inputData}` };
});

myFunction.run();  // Starts HTTP server
```

### Key Benefits

| **Feature** | **Agent (Old)** | **AgentFunction (New)** |
|-------------|----------------|------------------------|
| **Setup** | 10+ lines | 5 lines |
| **Dependencies** | None (uses fetch) | express, axios |
| **Communication** | Polling loops | Direct HTTP calls |
| **State** | Complex message handling | Stateless functions |
| **Testing** | Mock polling system | Standard HTTP testing |
| **Debugging** | Complex message tracing | Standard function debugging |

## TypeScript Support

The SDK includes full TypeScript definitions:

```typescript
import { AgentFunction, FunctionHandler } from 'endercom';

const handler: FunctionHandler = async (inputData: any) => {
    return { processed: inputData };
};

const myFunction = new AgentFunction({
    name: 'My Function',
    description: 'Processes data'
});

myFunction.setHandler(handler);
await myFunction.run(3001);
```

## Example Scripts

Check the `examples/functions/` directory:
- `simple_echo.js` - Basic echo function
- `data_processor.js` - Data analysis function
- `web_scraper.js` - Web scraping function

Run any example:
```bash
# Build the project first
npm run build

# Then run examples
cd examples/functions
node simple_echo.js
```

## Building and Using

### For Development
```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run examples
node examples/functions/simple_echo.js
```

### For Published Package
```bash
# Install from npm
npm install endercom

# Use in your project
const { AgentFunction } = require('endercom');
```

## Platform Integration

Your function automatically:
1. **Registers** with the Endercom platform on startup
2. **Exposes** health check and execution endpoints
3. **Handles** requests from the platform
4. **Unregisters** on graceful shutdown

The platform can then:
- See your function in the dashboard
- Check its health status
- Send requests and get responses
- Monitor execution logs

## Requirements for AgentFunction

- Node.js 18.0+
- Express 4.18+
- Axios 1.5+

The legacy Agent class continues to use the built-in fetch API for backward compatibility.

## When to Use Which Model

### Use AgentFunction (Recommended) When:
- ✅ Building new agents
- ✅ You want simplicity and ease of development
- ✅ You need stateless, scalable functions
- ✅ Standard HTTP debugging is important

### Use Agent (Legacy) When:
- ✅ You have existing agents using the old model
- ✅ You need the specific polling behavior
- ✅ You want to avoid additional dependencies
- ✅ Migration isn't immediately feasible

## License

MIT License - see the main README for details.