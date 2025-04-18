import { InventoryItem, Quantity } from '../types';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

export function parseQuantity(value: string): Quantity {
  const match = value.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/);
  if (!match) throw new Error(`Invalid quantity format: ${value}`);
  return { amount: parseFloat(match[1]), unit: match[2] };
}

export function readInventory(): InventoryItem[] {
  const csvFilePath = path.join(process.cwd(), 'food_inventory.csv');
  const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
  return parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  }) as InventoryItem[];
}

export function formatInventoryInfo(inventory: InventoryItem[]): string {
  return "Current inventory:\n" + inventory.map(item => `- ${item.name}: ${item.value}`).join('\n');
} 