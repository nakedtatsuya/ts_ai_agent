import { createReadStream, writeFileSync } from "fs";
import path from "path";
import { Agent } from "@mastra/core/agent";
import { OpenAIVoice } from "@mastra/voice-openai";
import { openai } from "@ai-sdk/openai";

// Initialize the voice provider with default settings
const voice = new OpenAIVoice(
  {
    speaker: "shimmer", // Japanese voice
  }
);

// Create an agent with voice capabilities
export const agent = new Agent({
  name: "Agent",
  instructions: `You are a helpful assistant with both STT and TTS capabilities.`,
  model: openai("gpt-4o"),
  voice,
});

// ヘルパー関数：ReadableStream → Buffer
async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

// Read audio file and transcribe
const audioFilePath = path.join(process.cwd(), "/voice.mp3");
const audioStream = createReadStream(audioFilePath);

try {
  const transcription = await agent.listen(audioStream, { filetype: "m4a" });
  // The agent can now use voice for interaction
  const audioBuffer = await agent.voice.speak(transcription.toString());
  const buffer = await streamToBuffer(audioBuffer);
  writeFileSync("output.mp3", buffer);
} catch (error) {
  console.error("Error transcribing audio:", error);
}
