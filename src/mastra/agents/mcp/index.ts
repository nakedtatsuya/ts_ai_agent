import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core";
import { MCPConfiguration } from "@mastra/mcp";

// Unix/Mac
const mcp = new MCPConfiguration({
  servers: {
    sequentialThinking: {
      command: "npx",
      args: [
        "-y",
        "@smithery/cli@latest",
        "run",
        "@smithery-ai/server-sequential-thinking",
        "--config",
        "{}",
      ],
    },
  },
});

export const mcpAgent = new Agent({
  name: "CLI Assistant",
  instructions: "You help users with CLI tasks",
  model: openai("gpt-4o-mini"),
  tools: await mcp.getTools(), // Tools are fixed at agent creation
});