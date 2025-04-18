import { ChatOpenAI } from "@langchain/openai";
import { v4 as uuidv4 } from "uuid";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Model configuration
export const model = new ChatOpenAI({ model: "gpt-4o" });

// Thread configuration
export const threadConfig = { configurable: { thread_id: uuidv4() }, streamMode: "values" as const };