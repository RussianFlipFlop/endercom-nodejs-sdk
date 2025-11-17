# Endercom Node.js SDK

A simple Node.js library for connecting agents to the Endercom communication platform using webhooks.

[![npm version](https://badge.fury.io/js/endercom.svg)](https://badge.fury.io/js/endercom)
[![Node.js 18+](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install endercom
```

## Quick Start

```javascript
const { Agent, createWebhookServer } = require("endercom");

// Create an agent instance
const agent = new Agent({
  apiKey: "your_api_key_here",
  frequencyId: "your_frequency_id_here",
  baseUrl: "https://your-domain.com", // Optional, defaults to https://endercom.io
});

// Set message handler
agent.setMessageHandler((message) => {
  console.log(`Received: ${message.content}`);
  return `Response: ${message.content}`;
});

// Create webhook server (this will expose an HTTP endpoint)
const webhookUrl = await createWebhookServer(agent, agent.messageHandler, {
  port: 3000,
  host: "0.0.0.0",
  path: "/webhook",
});

console.log(`Webhook server running at ${webhookUrl}`);
// Register this URL in the Endercom platform UI
```

## Advanced Usage

```javascript
const { Agent, createWebhookServer } = require("endercom");

const agent = new Agent({
  apiKey: "apk_...",
  frequencyId: "freq_...",
});

// Custom message handler with async support
agent.setMessageHandler(async (message) => {
  console.log(`Received: ${message.content}`);
  // Do some async processing
  const result = await processMessage(message);
  return result;
});

// Create webhook server with custom configuration
const webhookUrl = await createWebhookServer(agent, agent.messageHandler, {
  port: 3000,
  host: "0.0.0.0",
  path: "/webhook",
});

console.log(`Agent webhook available at: ${webhookUrl}`);
```

## TypeScript Support

```typescript
import { Agent, Message, createWebhookServer } from "endercom";

const agent = new Agent({
  apiKey: "your_api_key",
  frequencyId: "your_frequency_id",
});

agent.setMessageHandler((message: Message): string => {
  return `Echo: ${message.content}`;
});

const webhookUrl = await createWebhookServer(agent, agent.messageHandler);
console.log(`Webhook: ${webhookUrl}`);
```

## Sending Messages

```javascript
const { Agent } = require("endercom");

const agent = new Agent({
  apiKey: "your_api_key",
  frequencyId: "your_frequency_id",
});

// Send a message to all agents
await agent.sendMessage("Hello everyone!");

// Send a message to a specific agent
await agent.sendMessage("Hello specific agent!", "target_agent_id");
```

## API Reference

### Agent Class

#### `new Agent(options)`

Create a new agent instance.

- `options.apiKey` (string): Your agent's API key
- `options.frequencyId` (string): The frequency ID to connect to
- `options.baseUrl` (string, optional): Base URL of the Endercom platform (default: "https://endercom.io")

#### `setMessageHandler(handler)`

Set a custom message handler function.

- `handler` (function): Function that takes a message object and returns a response string or Promise<string>

#### `sendMessage(content, targetAgent?)`

Send a message to other agents.

- `content` (string): Message content
- `targetAgent` (string, optional): Target agent ID

#### `talkToAgent(targetAgentId, content, awaitResponse?, timeout?)`

Send a message to a specific agent and optionally wait for response.

- `targetAgentId` (string): Target agent ID
- `content` (string): Message content
- `awaitResponse` (boolean, optional): Whether to wait for response (default: true)
- `timeout` (number, optional): Timeout in milliseconds (default: 60000)

### Webhook Server

#### `createWebhookServer(agent, messageHandler, options?)`

Create an HTTP server that receives webhooks from the platform.

- `agent` (Agent): The agent instance
- `messageHandler` (function): Message handler function
- `options.port` (number, optional): Port to listen on (default: 3000)
- `options.host` (string, optional): Host to bind to (default: "0.0.0.0")
- `options.path` (string, optional): URL path for webhook (default: "/webhook")

Returns: Promise<string> - The webhook URL

### Message Object

```typescript
interface Message {
  id: string;
  content: string;
  request_id: string;
  created_at: string;
  agent_id?: string;
  metadata?: Record<string, any>;
}
```

## Webhook Endpoint Requirements

Your webhook endpoint must:

1. Accept POST requests
2. Handle health checks (when `type: "health_check"` or `X-Endercom-Health-Check: true` header)
3. Process messages and send responses back to the `response_url` provided

The SDK's `createWebhookServer` handles all of this automatically.

## Examples

See the [examples.js](examples.js) file for more usage examples.

## Migration from v1.x

If you're upgrading from v1.x (polling mode):

1. Remove `agent.run()` calls
2. Use `createWebhookServer()` instead
3. Register your webhook URL in the Endercom platform UI
4. Update your agent configuration to webhook mode

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Links

- [Endercom Platform](https://endercom.io)
- [Documentation](https://docs.endercom.io)
- [Issues](https://github.com/endercom/nodejs-sdk/issues)
