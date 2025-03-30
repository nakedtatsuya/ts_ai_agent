import { z } from "zod";
// npm i rss-parser
import { Agent, Step } from "@mastra/core";
import { RSSResources } from "./rss";
import { openai } from "@ai-sdk/openai";

export const reportAgent = new Agent({
  name: "report-agent",
  instructions:
    "あなたは世界中のAIに関するニュースをウォッチして解説してくれるジャーナリストです。" +
    "私に最新のAIニュースをわかりやすいレポートにして教えてください。原稿は日本語でお願いします。最終的には読み上げてもらうので、そのつもりでお願いします。"+
    "<IMPORTANT!>レポートは2万文字程度でお願いします。</IMPORTANT!>\n\n",
  model: openai("gpt-4o"),
  
});

export const reportStep = new Step({
  id: "reportStep",
  outputSchema: z.object({
    report: z.string()
  }),
  inputSchema: z.array(
    z.object({
      title: z.string(),
      link: z.string().url(),
      date: z.string(),
      description: z.string(),
    }),
  ),
  execute: async ({ context }) => {
    const rssInfo = context?.getStepResult<RSSResources[]>(
      "rssFetchStep",
    );
    const reportStep = context?.getStepResult<{
      report: string
    }>(
      "reportStep",
    );

    if (!rssInfo) {
      throw new Error("No RSS info found");
    }

    if (!reportStep) {}

    const prompt = `以下のリソースからレポートを生成して。<IMPORTANT!>2万文字程度でお願いします。</IMPORTANT!>\n\n${rssInfo
      .map((item) => `- ${item.title} (${item.date})\n${item.link}\n${item.description}`)
      .join("\n\n")}`;

    const res = await reportAgent.generate(prompt, {
      output: z.object({
        report: z.string()
      })
    });


    return res.object;
  }
});

