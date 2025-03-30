// import { createTool } from "@mastra/core/tools";
// import { date, z } from "zod";

// interface RSSResponse {
//   title: string;
//   link: string;
//   date: string;
//   content: string;
// }

// interface RSSFeed {
//   title: string;
//   link: string;
//   items: Array<RSSResponse>;
// }

// interface RSSResource {
//   title: string;
//   link: string;
//   date: string;
//   description: string;
// }

// export const rssTool = createTool({
//   id: "get-rss",
//   description: "AIに関するブログなどのRSSから最新のニュースを取得します。",
//   inputSchema: z.object({
//     theme: z.string().optional().describe("テーマ"),
//   }),
//   outputSchema: z.object({
//     resources: z.array(
//       z.object({
//         title: z.string(),
//         link: z.string().url(),
//         date: z.string(),
//         description: z.string(),
//       }),
//     )
//   }),
//   execute: async ({ context }) => {
//     return await getRSS(context.theme);
//   },
// });

// const getRSS = async (theme = 'AI, LLM, AI Agent' ) => {

//   const resources: Array<RSSResource> = []
  
//   const response = await fetch(weatherUrl);
//   const data: RSSFeed = await response.json();

//   return {
//     resources: data.items.map((item) => ({
//       title: item.title,
//       link: item.link,
//       date: item.date,
//       description: item.description,
//     })),
//   };
// };
