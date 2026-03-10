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
  | "food-water"
  | "hygiene"
  | "clothing"
  | "first-aid"
  | "equipment"
  | "lighting"
  | "tactical"
  | "notes"
  | "comms-radio"
  | "fire-cooking"
  | "tech"
  | "other";

export const CATEGORIES: { value: ItemCategory; label: string; icon: string }[] = [
  { value: "clothing", label: "Abbigliamento", icon: "👕" },
  { value: "notes", label: "Appunti & Documenti", icon: "📝" },
  { value: "equipment", label: "Attrezzatura", icon: "🏕️" },
  { value: "food-water", label: "Cibo e acqua", icon: "🍽️" },
  { value: "comms-radio", label: "Comms & Radio", icon: "📻" },
  { value: "fire-cooking", label: "Fuoco & Cucina", icon: "🔥" },
  { value: "hygiene", label: "Igiene", icon: "🧼" },
  { value: "lighting", label: "Illuminazione", icon: "🔦" },
  { value: "first-aid", label: "Primo Soccorso", icon: "🩹" },
  { value: "tactical", label: "Tattica", icon: "🎯" },
  { value: "tech", label: "Tech", icon: "📱" },
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
