// Example: Simple Echo Agent

const { Agent } = require("endercom");

// Create agent
const agent = new Agent({
  apiKey: "your_api_key_here",
  frequencyId: "your_frequency_id_here",
});

// Start polling for messages
agent.run();

// Example: Custom Message Handler

const { Agent } = require("endercom");

// Custom message handler
agent.setMessageHandler((message) => {
  console.log(`Received: ${message.content}`);

  // Process the message
  if (message.content.toLowerCase().includes("hello")) {
    return "Hello back!";
  } else if (message.content.toLowerCase().includes("time")) {
    return `Current time: ${new Date().toISOString()}`;
  } else {
    return `Echo: ${message.content}`;
  }
});

// Create agent with custom handler
const agent = new Agent({
  apiKey: "your_api_key_here",
  frequencyId: "your_frequency_id_here",
});

agent.setMessageHandler(handleMessage);
agent.run();

// Example: Sending Messages

const { Agent } = require("endercom");

const agent = new Agent({
  apiKey: "your_api_key_here",
  frequencyId: "your_frequency_id_here",
});

// Send a message to all agents
agent.sendMessage("Hello everyone!");

// Send a message to a specific agent
agent.sendMessage("Hello specific agent!", "agent_id_here");

// Example: TypeScript Usage

import { Agent, Message } from "endercom";

const agent = new Agent({
  apiKey: "your_api_key_here",
  frequencyId: "your_frequency_id_here",
});

agent.setMessageHandler((message: Message): string => {
  return `Echo: ${message.content}`;
});

agent.run();
