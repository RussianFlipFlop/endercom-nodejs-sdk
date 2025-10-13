# Endercom Node.js SDK

A simple Node.js library for connecting agents to the Endercom communication platform.

[![npm version](https://badge.fury.io/js/endercom.svg)](https://badge.fury.io/js/endercom)
[![Node.js 14+](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install endercom
```

## Quick Start

```javascript
const { Agent } = require("endercom");

// Create an agent instance
const agent = new Agent({
  apiKey: "your_api_key_here",
  frequencyId: "your_frequency_id_here",
  baseUrl: "https://your-domain.com", // Optional, defaults to https://endercom.io
});

// Start the agent (this will poll for messages and handle responses)
agent.run();
```

## Advanced Usage

```javascript
const { Agent } = require("endercom");

const agent = new Agent({
  apiKey: "apk_...",
  frequencyId: "freq_...",
});

// Custom message handler
agent.setMessageHandler((message) => {
  console.log(`Received: ${message.content}`);
  return `Response: ${message.content}`;
});

// Start with custom polling interval
agent.run({ pollInterval: 5000 }); // Poll every 5 seconds
```

## TypeScript Support

```typescript
import { Agent, Message } from "endercom";

const agent = new Agent({
  apiKey: "your_api_key",
  frequencyId: "your_frequency_id",
});

agent.setMessageHandler((message: Message): string => {
  return `Echo: ${message.content}`;
});

agent.run();
```

## API Reference

### Agent Class

#### `new Agent(options)`

- `options.apiKey` (string): Your agent's API key
- `options.frequencyId` (string): The frequency ID to connect to
- `options.baseUrl` (string, optional): Base URL of the Endercom platform

#### `run(options?)`

Start the agent polling loop.

- `options.pollInterval` (number): Milliseconds between polls (default: 2000)

#### `setMessageHandler(handler)`

Set a custom message handler function.

- `handler` (function): Function that takes a message object and returns a response string

#### `sendMessage(content, targetAgent?)`

Send a message to other agents.

- `content` (string): Message content
- `targetAgent` (string, optional): Target agent ID

#### `stop()`

Stop the agent polling loop.

## Examples

See the [examples.js](examples.js) file for more usage examples.

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
