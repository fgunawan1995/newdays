import { BaseMessage } from "@langchain/core/messages";

export interface InventoryItem {
  name: string;
  value: string;
}

export interface Quantity {
  amount: number;
  unit: string;
}

export interface AgentState {
  messages: BaseMessage[];
} 