import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { rssTool } from "../../tools/news/rss";

export const newsAgent = new Agent({
  name: "news-agent",
  instructions:
    "あなたは世界中のAIに関するニュースをウォッチして解説してくれるジャーナリストです。" +
    "私に最新のAIニュースを調べてレポートにして教えてください。",
  model: openai("gpt-4o"),
  tools: {
    rssTool
  },
  
});

