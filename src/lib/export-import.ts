import { getAllBags, getAllItems, importData } from "./db";
import type { ExportData } from "./types";
import { z } from "zod";

const CURRENT_VERSION = 1;

const exportSchema = z.object({
  version: z.number(),
  exportedAt: z.string(),
  bags: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    weightLimit: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })),
  items: z.array(z.object({
    id: z.string(),
    bagId: z.string(),
    name: z.string(),
    category: z.string(),
    weight: z.number(),
    quantity: z.number(),
    expiryDate: z.string().nullable(),
    checked: z.boolean(),
    notes: z.string(),
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
  await importData(data.bags as any, data.items as any);
  return { bags: data.bags.length, items: data.items.length };
}
