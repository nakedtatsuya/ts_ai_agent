
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { weatherWorkflow } from './workflows/weather';
import { weatherAgent } from './agents/weather';
import { chefAgent } from './agents/chef';
import { stockAgent } from './agents/stock';
import { candidateWorkflow } from './workflows/recruiter';
import { PgVector } from '@mastra/pg';
import { researchAgent } from './agents/research';
import { MastraVector } from '@mastra/core';
import { newsAgent } from './agents/news';
import { newsWorkflow } from './workflows/news';
// import { mcpAgent } from './agents/mcp';

// const pgVector = new PgVector(process.env.POSTGRES_CONNECTION_STRING)

export const mastra = new Mastra({
  workflows: { weatherWorkflow, candidateWorkflow, newsWorkflow },
  agents: { weatherAgent, chefAgent, stockAgent, researchAgent, newsAgent},
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
  // vectors: { pgVector },
});
