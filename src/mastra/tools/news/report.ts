import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { RSSResources } from "./rss";

export const reportTool = createTool({
  id: "gen-report",
  description: "RSSからレポートを生成します。",
  inputSchema: z.object({
    resourses: z.array(
      z.object({
        title: z.string(),
        link: z.string().url(),
        date: z.string(),
        description: z.string(),
      }),
    ).describe("RSSからFetchしたリソース"),
  }),
  outputSchema: z.object({
    report: z.string(),
  }),
  execute: async ({ context }) => {
    return await genReport(context.resourses);
  },
});

const genReport = async (resources: RSSResources[] ) => {
  const jsonString = JSON.stringify(resources, null, 2);
  

  return {
    report: `以下のリソースからレポートを生成します。\n\n${resources
      .map((item) => `- ${item.title} (${item.date})\n${item.link}\n${item.description}`)
      .join("\n\n")}`,
  }
};
