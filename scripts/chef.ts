import { z } from "zod";
import { chefAgent } from "../src/mastra/agents/chef";

async function main() {
  const query =
    "I want to make lasagna, can you generate a lasagna recipe for me?";
  console.log(`Query: ${query}`);

  // Define the Zod schema
  const schema = z.object({
    ingredients: z.array(
      z.object({
        name: z.string(),
        amount: z.string(),
      }),
    ),
    steps: z.array(z.string()),
  });

  const response = await chefAgent.generate(
    [{ role: "user", content: query }],
    { output: schema },
  );
  console.log("\n👨‍🍳 Chef Michel:", response.object);
}

main();