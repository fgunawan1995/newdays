import { z } from "zod";
import { Command } from "@langchain/langgraph";
import { AgentState } from "../types";
import { model } from "../config";

export async function groceryListBuilder(
  state: AgentState
): Promise<Command> {
  const systemPrompt = 
      "You are a grocery list expert that compiles required ingredients for selected recipes. " +
      "If you need recipe suggestions, ask 'recipeSuggester' for help. " +
      "If you need dietary guidance, ask 'dietaryAdvisor' for help. " +
      "If you need to check available ingredients, ask 'foodInventory' for help. " +
      "If you have enough information to respond to the user, return 'finish'. " +
      "Never mention other agents by name.";

  const messages = [{"role": "system", "content": systemPrompt}, ...state.messages];
  const targetAgentNodes = ["recipeSuggester", "dietaryAdvisor", "foodInventory"];
  
  const outputSchema = z.object({
    response: z.string().describe("A human readable response to the original question. Does not need to be a final response. Will be streamed back to the user."),
    goto: z.enum(["finish", ...targetAgentNodes]).describe("The next agent to call, or 'finish' if the user's query has been resolved. Must be one of the specified values."),
  });
  
  const response = await model.withStructuredOutput(outputSchema, { name: "Response" }).invoke(messages);
  const aiMsg = {"role": "ai", "content": response.response, "name": "groceryListBuilder"};

  let goto = response.goto;
  if (goto === "finish") {
      goto = "human";
  }

  return new Command({ goto, update: {"messages": [aiMsg] } });
} 