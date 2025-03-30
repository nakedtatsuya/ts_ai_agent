import { mastra } from "../src/mastra";

(async () => {
  const { runId, start } = mastra.getWorkflow("candidateWorkflow").createRun();

  console.log("Run", runId);

  const runResult = await start({
    triggerData: { resumeText: "Simulated resume content..." },
  });

  console.log("Final output:", runResult.results);
})();