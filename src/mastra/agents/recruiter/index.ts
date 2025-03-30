import { Agent } from '@mastra/core/agent';
import { openai } from "@ai-sdk/openai";

export const recruiter = new Agent({
  name: "Recruiter Agent",
  instructions: `You are a recruiter.`,
  model: openai("gpt-4o-mini"),
})

