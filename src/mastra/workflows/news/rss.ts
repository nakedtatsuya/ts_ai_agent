import {  z } from "zod";
// npm i rss-parser
import Parser from 'rss-parser';
import { Step } from "@mastra/core";
export interface RSSResources {
  title: string;
  link: string;
  date: string;
  description: string;
}

export const rssFetchStep = new Step({
  id: "rssFetchStep",
  inputSchema: z.object({
    theme: z.string().optional().describe("テーマ"),
  }),
  outputSchema: z.array(
    z.object({
      title: z.string(),
      link: z.string().url(),
      date: z.string(),
      description: z.string(),
    }),
  ),
  execute: async ({ context }) => {
    // const candidateInfo = context?.getStepResult<CandidateInfo>(
    //   "gatherCandidateInfo",
    // );

    const rssUrls = [
      "https://raw.githubusercontent.com/Olshansk/rss-feeds/refs/heads/main/feeds/feed_anthropic.xml",
      "https://blog.google/rss/",
      "https://blog.samaltman.com/posts.atom",
      "https://karpathy.github.io/feed.xml",
      "https://www.technologyreview.com/topic/artificial-intelligence/feed/",
      "https://openai.com/news/rss.xml",
    ]
    return await getRSS(rssUrls);
  },
});



/**
 * 複数のRSSフィードURLを受け取り、それぞれのフィードと記事情報を取得して返す関数
 *
 * @param urls RSSフィードのURL配列
 * @returns RSSFeedオブジェクトの配列
 */
export async function getRSS(urls: string[]): Promise<RSSResources[]> {
  const parser = new Parser();
  const results: RSSResources[] = [];

  for (const url of urls) {
    try {
      // rss-parser でフィードをパース
      const feed = await parser.parseURL(url);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 1);

      // フィードの items から必要な情報を抽出
      const items: RSSResources[] = await Promise.all(feed.items.filter((item) => {
        const dateStr = item.isoDate ?? item.pubDate;
        if (!dateStr) return false;
        const date = new Date(dateStr);
        return date >= threeMonthsAgo;
      }).map(async (item) => {
        const contentEncoded = (item as any)['content:encoded'];
        const link = item.link ?? '';
        let fetchedBody = '';

        if (link) {
          try {
            const res = await fetch(link);
            if (res.ok) {
              fetchedBody = await res.text();
            }
          } catch (err) {
            console.error(`Error fetching ${link}:`, err);
          }
        }

        return {
          title: item.title ?? '',
          link,
          date: item.isoDate ?? item.pubDate ?? '',
          description: contentEncoded ?? item.content ?? '',
          // body: fetchedBody,
        };
      }));
      results.push(...items);
    } catch (error) {
      console.error(`Failed to parse RSS from ${url}:`, error);
    }
  }

  return results
}
