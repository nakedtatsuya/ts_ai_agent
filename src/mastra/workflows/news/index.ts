import { Step, Workflow } from "@mastra/core/workflows";
import { z } from "zod";
import { rssFetchStep, RSSResources } from "./rss";
import { reportStep } from "./report";
import { speachStep } from "./speach";

export const newsWorkflow = new Workflow({
  name: "news-workflow",
  triggerSchema: z.object({
  }),
});

newsWorkflow
  .step(rssFetchStep)
  .then(reportStep)
  .then(speachStep)
  // .after(gatherCandidateInfo)
  // .step(askAboutRole, {
  //   when: { "gatherCandidateInfo.isTechnical": false },
  // });

newsWorkflow.commit();