import { writeFileSync } from "fs";
import path from "path";
import { Agent } from "@mastra/core/agent";
import { OpenAIVoice } from "@mastra/voice-openai";
import { openai } from "@ai-sdk/openai";
import { Step } from "@mastra/core";
import { z } from "zod";

// Initialize the voice provider with default settings
const voice = new OpenAIVoice(
  {
    speaker: "shimmer", // Japanese voice
  }
) as any

// Create an agent with voice capabilities
export const agent = new Agent({
  name: "Agent",
  instructions: `You are a helpful assistant with both STT and TTS capabilities.`,
  model: openai("gpt-4o"),
  voice
});

export const speachStep = new Step({
  id: "speachStep",
  outputSchema: z.object({
    filepath: z.string()
  }),
  inputSchema: z.object({
    report: z.string()
  }),
  execute: async ({ context }) => {
    const reportStep = context?.getStepResult<{
      report: string
    }>(
      "reportStep",
    );

    if (!reportStep) {
      throw new Error("No RSS info found");
    }

    const audioBuffer = await agent.voice?.speak(reportStep.report);
    if (!audioBuffer) {
      throw new Error("No audio buffer found");
    }
    const buffer = await streamToBuffer(audioBuffer);
    writeFileSync("output.mp3", buffer);
    const audioFilePath = path.join(process.cwd(), "/output.mp3");
    return {
      filepath:audioFilePath
    };
  }
});

// ヘルパー関数：ReadableStream → Buffer
async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}