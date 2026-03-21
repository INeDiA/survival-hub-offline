import type { Bag, Item, ItemCategory } from "@/lib/types";

export type StarterLanguage = "en" | "it";

type LocalizedText = Record<StarterLanguage, string>;

interface StarterTemplateItem {
  name: LocalizedText;
  category: ItemCategory;
  weight: number;
  quantity: number;
  checked: boolean;
  notes?: LocalizedText;
}

interface StarterTemplateDefinition {
  id: string;
  icon: string;
  bagName: LocalizedText;
  bagDescription: LocalizedText;
  summary: LocalizedText;
  weightLimit: number;
  bagWeight: number;
  items: StarterTemplateItem[];
}

export const STARTER_ONBOARDING_KEY = "bugout-onboarding-completed";

const starterTemplates: StarterTemplateDefinition[] = [
  {
    id: "bob-72h",
    icon: "🎒",
    bagName: {
      en: "BOB 72h",
      it: "BOB 72h",
    },
    bagDescription: {
      en: "Balanced 72-hour evacuation bag with water, shelter, medical kit and core tools.",
      it: "Zaino da evacuazione bilanciato per 72 ore con acqua, riparo, kit medico e strumenti essenziali.",
    },
    summary: {
      en: "General-purpose setup for leaving quickly with a solid, versatile base.",
      it: "Setup generico per partire rapidamente con una base solida e versatile.",
    },
    weightLimit: 15000,
    bagWeight: 1800,
    items: [
      { name: { en: "Water bottles", it: "Bottiglie d'acqua" }, category: "food-water", weight: 1000, quantity: 2, checked: true },
      { name: { en: "Energy bars", it: "Barrette energetiche" }, category: "food-water", weight: 450, quantity: 6, checked: true },
      { name: { en: "Compact first aid kit", it: "Kit pronto soccorso compatto" }, category: "first-aid", weight: 350, quantity: 1, checked: true },
      { name: { en: "Emergency tarp", it: "Telo d'emergenza" }, category: "equipment", weight: 500, quantity: 1, checked: true },
      { name: { en: "Headlamp", it: "Lampada frontale" }, category: "lighting", weight: 120, quantity: 1, checked: true },
      { name: { en: "Multitool", it: "Multiuso" }, category: "equipment", weight: 240, quantity: 1, checked: true },
      { name: { en: "Spare socks", it: "Calze di ricambio" }, category: "clothing", weight: 80, quantity: 2, checked: false },
      { name: { en: "Document pouch", it: "Busta documenti" }, category: "notes", weight: 120, quantity: 1, checked: false },
    ],
  },
  {
    id: "civil-emergency",
    icon: "🏠",
    bagName: {
      en: "Civil Emergency",
      it: "Emergenza civile",
    },
    bagDescription: {
      en: "Urban emergency kit for blackout, evacuation and temporary displacement.",
      it: "Kit urbano per blackout, evacuazione e allontanamento temporaneo da casa.",
    },
    summary: {
      en: "Focused on documents, communication, power and practical city essentials.",
      it: "Pensato per documenti, comunicazioni, energia e beni pratici da contesto urbano.",
    },
    weightLimit: 12000,
    bagWeight: 1400,
    items: [
      { name: { en: "Power bank", it: "Power bank" }, category: "tech", weight: 280, quantity: 1, checked: true },
      { name: { en: "Charging cables", it: "Cavi di ricarica" }, category: "tech", weight: 90, quantity: 2, checked: true },
      { name: { en: "Portable radio", it: "Radio portatile" }, category: "comms-radio", weight: 220, quantity: 1, checked: true },
      { name: { en: "Flashlight", it: "Torcia" }, category: "lighting", weight: 150, quantity: 1, checked: true },
      { name: { en: "Copies of documents", it: "Copie dei documenti" }, category: "notes", weight: 100, quantity: 1, checked: true },
      { name: { en: "Hygiene kit", it: "Kit igiene" }, category: "hygiene", weight: 300, quantity: 1, checked: true },
      { name: { en: "Cash reserve", it: "Contanti di emergenza" }, category: "notes", weight: 20, quantity: 1, checked: false },
      { name: { en: "Water bottle", it: "Borraccia" }, category: "food-water", weight: 750, quantity: 1, checked: false },
    ],
  },
  {
    id: "minimalist",
    icon: "🪶",
    bagName: {
      en: "Minimalist",
      it: "Minimalista",
    },
    bagDescription: {
      en: "Lightweight foundation with only the core items to customize later.",
      it: "Base leggera con soli elementi essenziali, da personalizzare in seguito.",
    },
    summary: {
      en: "Small, fast and easy to adapt if you want to start simple.",
      it: "Piccolo, rapido e facile da adattare se vuoi partire in modo semplice.",
    },
    weightLimit: 8000,
    bagWeight: 900,
    items: [
      { name: { en: "Water flask", it: "Borraccia" }, category: "food-water", weight: 600, quantity: 1, checked: true },
      { name: { en: "Compact poncho", it: "Poncho compatto" }, category: "clothing", weight: 250, quantity: 1, checked: true },
      { name: { en: "Pocket knife", it: "Coltellino tascabile" }, category: "equipment", weight: 120, quantity: 1, checked: true },
      { name: { en: "Mini first aid kit", it: "Mini kit pronto soccorso" }, category: "first-aid", weight: 180, quantity: 1, checked: true },
      { name: { en: "Lighter", it: "Accendino" }, category: "fire-cooking", weight: 30, quantity: 1, checked: false },
      { name: { en: "Phone charger", it: "Caricatore telefono" }, category: "tech", weight: 90, quantity: 1, checked: false },
    ],
  },
];

export function getStarterTemplates(lang: StarterLanguage) {
  return starterTemplates.map((template) => ({
    id: template.id,
    icon: template.icon,
    name: template.bagName[lang],
    description: template.summary[lang],
    itemCount: template.items.length,
  }));
}

export function buildStarterTemplateData(templateId: string, lang: StarterLanguage): { bag: Bag; items: Item[] } {
  const template = starterTemplates.find((entry) => entry.id === templateId) ?? starterTemplates[0];
  const bagId = crypto.randomUUID();
  const now = new Date().toISOString();

  return {
    bag: {
      id: bagId,
      name: template.bagName[lang],
      description: template.bagDescription[lang],
      weightLimit: template.weightLimit,
      bagWeight: template.bagWeight,
      createdAt: now,
      updatedAt: now,
    },
    items: template.items.map((item) => ({
      id: crypto.randomUUID(),
      bagId,
      name: item.name[lang],
      category: item.category,
      weight: item.weight,
      quantity: item.quantity,
      expiryDate: null,
      checked: item.checked,
      notes: item.notes?.[lang] ?? "",
    })),
  };
}