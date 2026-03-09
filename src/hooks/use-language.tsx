import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Language = "en" | "it";

const translations = {
  en: {
    // Header
    appTitle: "BugOut Manager",
    
    // Index page
    totalWeight: "Total Weight",
    expiring: "Expiring",
    expiringItems: "Expiring items",
    expiredDaysAgo: (d: number) => `Expired ${d}d ago`,
    daysLeft: (d: number) => `${d}d`,
    yourBags: "Your bags",
    loading: "Loading...",
    noBagsCreated: "No bags created",
    createFirstBag: "Create your first bugout bag to get started",
    
    // Bag detail
    items: "items",
    present: "present",
    sortBy: "Sort by",
    category: "Category",
    nameSort: "Name",
    weightSort: "Weight ↓",
    all: "All",
    toAdd: "⬜ To add",
    inBag: "📦 In bag",
    noItemsPresent: "No items present",
    noItemsInBag: "No items in the bag",
    
    // Add bag
    newBag: "New Bag",
    name: "Name",
    description: "Description",
    bagNamePlaceholder: "BOB 72h",
    bagDescPlaceholder: "Main evacuation bag...",
    weightLimit: "Weight limit",
    bagWeight: "Bag weight",
    createBag: "Create Bag",
    
    // Edit bag
    editBag: "Edit Bag",
    saveChanges: "Save Changes",
    unit: "Unit",
    
    // Add item
    addItem: "Add Item",
    add: "Add",
    itemNamePlaceholder: "1L Water bottle",
    weight: "Weight",
    quantity: "Quantity",
    expiryOptional: "Expiry (optional)",
    selectDate: "Select date",
    notes: "Notes",
    notesPlaceholder: "Additional notes...",
    alreadyInBag: "Already in bag",
    
    // Edit item
    editItem: "Edit Item",
    
    // Item row
    moveToAdd: "Move to 'To add'",
    moveToInBag: "Move to 'In bag'",
    deleteItemTitle: (name: string) => `Delete "${name}"?`,
    cannotBeUndone: "This action cannot be undone.",
    cancel: "Cancel",
    delete: "Delete",
    
    // Bag card
    deleteBagTitle: (name: string) => `Delete "${name}"?`,
    deleteBagDesc: "All items inside will be deleted. This action cannot be undone.",
    inExpiry: "expiring",
    
    // Move item
    moveItem: "Move Item",
    moveItemTo: (name: string) => `Move ${name} to another bag:`,
    noOtherBags: "No other bags available.",
    destinationBag: "Destination bag",
    selectBag: "Select bag",
    move: "Move",
    
    // Bulk add
    importList: "Import List",
    onePerLine: "One item per line",
    bulkPlaceholder: "LED Flashlight\nMultitool\nFirst aid kit\nLighter",
    itemsToAdd: (n: number) => `${n} item${n === 1 ? "" : "s"} to add`,
    addItems: (n: number) => `Add ${n > 0 ? n : ""} item${n === 1 ? "" : "s"}`,
    
    // Add item dropdown
    addItemMenu: "Add Item",
    
    // Hamburger menu
    lightTheme: "Light theme",
    darkTheme: "Dark theme",
    backupRestore: "Backup & Restore",
    exportAll: "Export all data (JSON)",
    importBackup: "Import backup",
    importWarning: "⚠ Import will overwrite all existing data.",
    backupSuccess: "Backup exported successfully",
    backupError: "Error during export",
    importSuccess: (bags: number, items: number) => `Imported ${bags} bags and ${items} items`,
    importError: "Invalid or corrupted file",
    language: "Language",
    lbsLabel: "Lbs",
    
    // Expiry badge
    expired: "Expired",
    
    // Not found
    pageNotFound: "Oops! Page not found",
    returnHome: "Return to Home",
    
    // Categories
    cat_foodWater: "Food & Water",
    cat_hygiene: "Hygiene",
    cat_clothing: "Clothing",
    cat_medicine: "Medicine",
    cat_equipment: "Equipment",
    cat_lighting: "Lighting",
    cat_tactical: "Tactical",
    cat_notes: "Notes & Documents",
    cat_accessories: "Accessories",
    cat_other: "Other",
  },
  it: {
    appTitle: "BugOut Manager",
    totalWeight: "Peso Totale",
    expiring: "In Scadenza",
    expiringItems: "Articoli in scadenza",
    expiredDaysAgo: (d: number) => `Scaduto da ${d}gg`,
    daysLeft: (d: number) => `${d}gg`,
    yourBags: "I tuoi zaini",
    loading: "Caricamento...",
    noBagsCreated: "Nessuno zaino creato",
    createFirstBag: "Crea il tuo primo bugout bag per iniziare",
    items: "oggetti",
    present: "presenti",
    sortBy: "Ordina per",
    category: "Categoria",
    nameSort: "Nome",
    weightSort: "Peso ↓",
    all: "Tutti",
    toAdd: "⬜ Da aggiungere",
    inBag: "📦 Nello zaino",
    noItemsPresent: "Nessun oggetto presente",
    noItemsInBag: "Nessun oggetto nello zaino",
    newBag: "Nuovo Zaino",
    name: "Nome",
    description: "Descrizione",
    bagNamePlaceholder: "BOB 72h",
    bagDescPlaceholder: "Zaino principale per evacuazione...",
    weightLimit: "Limite peso",
    bagWeight: "Peso zaino",
    createBag: "Crea Zaino",
    editBag: "Modifica Zaino",
    saveChanges: "Salva Modifiche",
    unit: "Unità",
    addItem: "Aggiungi Oggetto",
    add: "Aggiungi",
    itemNamePlaceholder: "Bottiglia d'acqua 1L",
    weight: "Peso",
    quantity: "Quantità",
    expiryOptional: "Scadenza (opzionale)",
    selectDate: "Seleziona data",
    notes: "Note",
    notesPlaceholder: "Note aggiuntive...",
    alreadyInBag: "Già nello zaino",
    editItem: "Modifica Oggetto",
    moveToAdd: "Sposta in 'Da aggiungere'",
    moveToInBag: "Sposta in 'Nello zaino'",
    deleteItemTitle: (name: string) => `Eliminare "${name}"?`,
    cannotBeUndone: "Questa azione non può essere annullata.",
    cancel: "Annulla",
    delete: "Elimina",
    deleteBagTitle: (name: string) => `Eliminare "${name}"?`,
    deleteBagDesc: "Tutti gli oggetti al suo interno verranno eliminati. Questa azione non può essere annullata.",
    inExpiry: "in scadenza",
    moveItem: "Sposta Oggetto",
    moveItemTo: (name: string) => `Sposta ${name} in un altro zaino:`,
    noOtherBags: "Nessun altro zaino disponibile.",
    destinationBag: "Zaino di destinazione",
    selectBag: "Seleziona zaino",
    move: "Sposta",
    importList: "Importa Lista",
    onePerLine: "Un oggetto per riga",
    bulkPlaceholder: "Torcia LED\nColtello multiuso\nKit pronto soccorso\nAccendino",
    itemsToAdd: (n: number) => `${n} oggett${n === 1 ? "o" : "i"} da aggiungere`,
    addItems: (n: number) => `Aggiungi ${n > 0 ? n : ""} oggett${n === 1 ? "o" : "i"}`,
    addItemMenu: "Aggiungi Oggetto",
    lightTheme: "Tema chiaro",
    darkTheme: "Tema scuro",
    backupRestore: "Backup & Ripristino",
    exportAll: "Esporta tutti i dati (JSON)",
    importBackup: "Importa backup",
    importWarning: "⚠ L'importazione sovrascriverà tutti i dati esistenti.",
    backupSuccess: "Backup esportato con successo",
    backupError: "Errore durante l'esportazione",
    importSuccess: (bags: number, items: number) => `Importati ${bags} zaini e ${items} oggetti`,
    importError: "File non valido o corrotto",
    language: "Lingua",
    lbsLabel: "Libbre",
    expired: "Scaduto",
    pageNotFound: "Oops! Pagina non trovata",
    returnHome: "Torna alla Home",
    cat_foodWater: "Cibo e acqua",
    cat_hygiene: "Igiene",
    cat_clothing: "Abbigliamento",
    cat_medicine: "Medicinali",
    cat_equipment: "Attrezzatura",
    cat_lighting: "Illuminazione",
    cat_tactical: "Tattica",
    cat_notes: "Appunti & Documenti",
    cat_accessories: "Accessori",
    cat_other: "Altro",
  },
} as const;

export type Translations = typeof translations.en;

const LanguageContext = createContext<{
  lang: Language;
  t: Translations;
  setLang: (l: Language) => void;
}>({
  lang: "en",
  t: translations.en,
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    return (localStorage.getItem("language") as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("language", lang);
  }, [lang]);

  const t = translations[lang] as Translations;

  return (
    <LanguageContext.Provider value={{ lang, t, setLang: setLangState }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

const categoryKeyMap: Record<string, keyof Translations> = {
  "food-water": "cat_foodWater",
  hygiene: "cat_hygiene",
  clothing: "cat_clothing",
  medicine: "cat_medicine",
  equipment: "cat_equipment",
  lighting: "cat_lighting",
  tactical: "cat_tactical",
  notes: "cat_notes",
  accessories: "cat_accessories",
  other: "cat_other",
};

export function useCategoryLabel(category: string): string {
  const { t } = useLanguage();
  const key = categoryKeyMap[category];
  return key ? (t[key] as string) : category;
}

export function useTranslatedCategories() {
  const { t } = useLanguage();
  return [
    { value: "food-water" as const, label: t.cat_foodWater, icon: "🍽️" },
    { value: "hygiene" as const, label: t.cat_hygiene, icon: "🧼" },
    { value: "clothing" as const, label: t.cat_clothing, icon: "👕" },
    { value: "medicine" as const, label: t.cat_medicine, icon: "💊" },
    { value: "equipment" as const, label: t.cat_equipment, icon: "🏕️" },
    { value: "lighting" as const, label: t.cat_lighting, icon: "🔦" },
    { value: "tactical" as const, label: t.cat_tactical, icon: "🎯" },
    { value: "notes" as const, label: t.cat_notes, icon: "📝" },
    { value: "accessories" as const, label: t.cat_accessories, icon: "🎒" },
    { value: "other" as const, label: t.cat_other, icon: "📦" },
  ];
}
