import { z } from "zod";
import { Command } from "@langchain/langgraph";
import { AgentState } from "../types";
import { model } from "../config";
import { readInventory, formatInventoryInfo } from "../utils/inventory";

export async function foodInventory(
  state: AgentState
): Promise<Command> {
  const systemPrompt = 
      "You are an inventory expert that tracks available ingredients and suggests using existing items. " +
      "You have access to a CSV file containing the current inventory. " +
      "When asked about ingredients, check the inventory and provide accurate information about what's available. " +
      "If you need recipe suggestions, ask 'recipeSuggester' for help. " +
      "If you need dietary guidance, ask 'dietaryAdvisor' for help. " +
      "If you need to create a grocery list, ask 'groceryListBuilder' for help. " +
      "If you have enough information to respond to the user, return 'finish'. " +
      "Never mention other agents by name.";

  const inventory = readInventory();
  const inventoryInfo = formatInventoryInfo(inventory);
  
  const messages = [
    {"role": "system", "content": systemPrompt + "\n\n" + inventoryInfo},
    ...state.messages
  ];

  const targetAgentNodes = ["recipeSuggester", "dietaryAdvisor", "groceryListBuilder"];
  
  const outputSchema = z.object({
    response: z.string().describe("A human readable response to the original question. Does not need to be a final response. Will be streamed back to the user."),
    goto: z.enum(["finish", ...targetAgentNodes]).describe("The next agent to call, or 'finish' if the user's query has been resolved. Must be one of the specified values."),
  });
  
  const response = await model.withStructuredOutput(outputSchema, { name: "Response" }).invoke(messages);
  const aiMsg = {"role": "ai", "content": response.response, "name": "foodInventory"};

  let goto = response.goto;
  if (goto === "finish") {
      goto = "human";
  }

  return new Command({ goto, update: {"messages": [aiMsg] } });
} 