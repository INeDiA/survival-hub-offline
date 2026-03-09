import { getAllBags, getAllItems, importData } from "./db";
import type { ExportData, ItemCategory } from "./types";
import { CATEGORIES } from "./types";
import { z } from "zod";

const CURRENT_VERSION = 1;

const categoryValues = CATEGORIES.map(c => c.value) as [ItemCategory, ...ItemCategory[]];

const exportSchema = z.object({
  version: z.number(),
  exportedAt: z.string(),
  bags: z.array(z.object({
    id: z.string(),
    name: z.string().min(1).max(200),
    description: z.string().max(1000),
    weightLimit: z.number().min(0).max(1_000_000),
    createdAt: z.string(),
    updatedAt: z.string(),
  })),
  items: z.array(z.object({
    id: z.string(),
    bagId: z.string(),
    name: z.string().min(1).max(200),
    category: z.enum(categoryValues),
    weight: z.number().min(0).max(1_000_000),
    quantity: z.number().int().min(1).max(9999),
    expiryDate: z.string().datetime().nullable(),
    checked: z.boolean(),
    notes: z.string().max(2000),
  })),
});

export async function exportAllData(): Promise<string> {
  const bags = await getAllBags();
  const items = await getAllItems();
  const data: ExportData = {
    version: CURRENT_VERSION,
    exportedAt: new Date().toISOString(),
    bags,
    items,
  };
  return JSON.stringify(data, null, 2);
}

export function downloadJson(json: string, filename: string) {
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importFromJson(json: string): Promise<{ bags: number; items: number }> {
  const raw = JSON.parse(json);
  const data = exportSchema.parse(raw);
  await importData(data.bags, data.items);
  return { bags: data.bags.length, items: data.items.length };
}
