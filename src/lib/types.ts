export interface Bag {
  id: string;
  name: string;
  description: string;
  weightLimit: number; // grams
  bagWeight: number; // grams - weight of the bag itself
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: string;
  bagId: string;
  name: string;
  category: ItemCategory;
  weight: number; // grams
  quantity: number;
  expiryDate: string | null;
  checked: boolean;
  notes: string;
}

export type ItemCategory =
  | "water"
  | "food"
  | "shelter"
  | "first-aid"
  | "fire"
  | "tools"
  | "hygiene"
  | "communication"
  | "documents"
  | "clothing"
  | "lighting"
  | "navigation"
  | "defense"
  | "other";

export const CATEGORIES: { value: ItemCategory; label: string; icon: string }[] = [
  { value: "water", label: "Acqua", icon: "💧" },
  { value: "food", label: "Cibo", icon: "🥫" },
  { value: "shelter", label: "Riparo", icon: "⛺" },
  { value: "first-aid", label: "Primo Soccorso", icon: "🏥" },
  { value: "fire", label: "Fuoco", icon: "🔥" },
  { value: "tools", label: "Strumenti", icon: "🔧" },
  { value: "hygiene", label: "Igiene", icon: "🧼" },
  { value: "communication", label: "Comunicazione", icon: "📻" },
  { value: "documents", label: "Documenti", icon: "📄" },
  { value: "clothing", label: "Abbigliamento", icon: "👕" },
  { value: "lighting", label: "Illuminazione", icon: "🔦" },
  { value: "navigation", label: "Navigazione", icon: "🧭" },
  { value: "defense", label: "Difesa", icon: "🛡️" },
  { value: "other", label: "Altro", icon: "📦" },
];

export const getCategoryInfo = (cat: ItemCategory) =>
  CATEGORIES.find((c) => c.value === cat) ?? CATEGORIES[CATEGORIES.length - 1];

export interface ExportData {
  version: number;
  exportedAt: string;
  bags: Bag[];
  items: Item[];
}

export const EXPIRY_WARNING_DAYS = 30;
