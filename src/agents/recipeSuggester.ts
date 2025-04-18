import { z } from "zod";
import { Command } from "@langchain/langgraph";
import { AgentState } from "../types";
import { model } from "../config";

export async function recipeSuggester(
  state: AgentState
): Promise<Command> {
  const systemPrompt = 
      "You are a recipe expert that suggests meals based on user preferences and constraints. " +
      "If you need dietary guidance, ask 'dietaryAdvisor' for help. " +
      "If you need to check available ingredients, ask 'foodInventory' for help. " +
      "If you need to create a grocery list, ask 'groceryListBuilder' for help. " +
      "If you have enough information to respond to the user, return 'finish'. " +
      "Never mention other agents by name.";

  const messages = [{"role": "system", "content": systemPrompt}, ...state.messages];
  const targetAgentNodes = ["dietaryAdvisor", "foodInventory", "groceryListBuilder"];
  
  const outputSchema = z.object({
    response: z.string().describe("A human readable response to the original question. Does not need to be a final response. Will be streamed back to the user."),
    goto: z.enum(["finish", ...targetAgentNodes]).describe("The next agent to call, or 'finish' if the user's query has been resolved. Must be one of the specified values."),
  });
  
  const response = await model.withStructuredOutput(outputSchema, { name: "Response" }).invoke(messages);
  const aiMsg = {"role": "ai", "content": response.response, "name": "recipeSuggester"};

  let goto = response.goto;
  if (goto === "finish") {
      goto = "human";
  }

  return new Command({goto, update: { "messages": [aiMsg] } });
} 