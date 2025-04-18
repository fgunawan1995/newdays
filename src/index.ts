import { createInterface } from 'readline';
import {
  MessagesAnnotation,
  StateGraph,
  START,
  Command,
  MemorySaver
} from "@langchain/langgraph";

import { threadConfig } from './config';
import { recipeSuggester } from './agents/recipeSuggester';
import { dietaryAdvisor } from './agents/dietaryAdvisor';
import { groceryListBuilder } from './agents/groceryListBuilder';
import { foodInventory } from './agents/foodInventory';
import { humanNode } from './agents/humanNode';

const builder = new StateGraph(MessagesAnnotation)
  .addNode("recipeSuggester", recipeSuggester, {
    ends: ["dietaryAdvisor", "foodInventory", "groceryListBuilder"]
  })
  .addNode("dietaryAdvisor", dietaryAdvisor, {
    ends: ["human", "recipeSuggester", "foodInventory", "groceryListBuilder"]
  })
  .addNode("groceryListBuilder", groceryListBuilder, {
    ends: ["human", "recipeSuggester", "dietaryAdvisor", "foodInventory"]
  })
  .addNode("foodInventory", foodInventory, {
    ends: ["human", "recipeSuggester", "dietaryAdvisor", "groceryListBuilder"]
  })
  .addNode("human", humanNode, {
    ends: ["recipeSuggester", "dietaryAdvisor", "groceryListBuilder", "foodInventory", "human"]
  })
  .addEdge(START, "recipeSuggester")

const checkpointer = new MemorySaver()
const graph = builder.compile({ checkpointer })

async function main() {
    const readline = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (query: string): Promise<string> => {
        return new Promise((resolve) => readline.question(query, resolve));
    };

    var iter = 0;

    try {
        while (true) {
            const userInput = await question('\nYou (or "exit" to quit): ');
            if (userInput.toLowerCase() === 'exit') break;

            let input: { messages: { role: string; content: string; }[] } | Command;
            if (iter === 0) {
                input = {
                    messages: [
                        { role: "user", content: userInput }
                    ]
                };
            } else {
                input = new Command({ resume: userInput });
            }

            let lastAiMessage = null;
            for await (const update of await graph.stream(input, threadConfig)) {
                const lastMessage = update.messages ? update.messages[update.messages.length - 1] : undefined;
                if (lastMessage && lastMessage._getType() === "ai") {
                  lastAiMessage = lastMessage;
                }
            }
            if (lastAiMessage) {
                console.log(`${lastAiMessage.name}: ${lastAiMessage.content}`);
            }
            iter += 1;
        }
    } finally {
        readline.close();
    }
}

main().catch(console.error); 