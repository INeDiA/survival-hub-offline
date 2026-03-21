import { openDB, type IDBPDatabase } from "idb";
import type { Bag, Item } from "./types";

const DB_NAME = "bugout-bag-db";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("bags")) {
          db.createObjectStore("bags", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("items")) {
          const store = db.createObjectStore("items", { keyPath: "id" });
          store.createIndex("bagId", "bagId", { unique: false });
        }
      },
    });
  }
  return dbPromise;
}

// Bags
export async function getAllBags(): Promise<Bag[]> {
  const db = await getDB();
  return db.getAll("bags");
}

export async function getBag(id: string): Promise<Bag | undefined> {
  const db = await getDB();
  return db.get("bags", id);
}

export async function saveBag(bag: Bag): Promise<void> {
  const db = await getDB();
  await db.put("bags", bag);
}

export async function deleteBag(id: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(["bags", "items"], "readwrite");
  await tx.objectStore("bags").delete(id);
  const itemStore = tx.objectStore("items");
  const items = await itemStore.index("bagId").getAllKeys(id);
  for (const key of items) {
    await itemStore.delete(key);
  }
  await tx.done;
}

// Items
export async function getItemsByBag(bagId: string): Promise<Item[]> {
  const db = await getDB();
  return db.getAllFromIndex("items", "bagId", bagId);
}

export async function getAllItems(): Promise<Item[]> {
  const db = await getDB();
  return db.getAll("items");
}

export async function saveItem(item: Item): Promise<void> {
  const db = await getDB();
  await db.put("items", item);
}

export async function deleteItem(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("items", id);
}

export async function seedBagWithItems(bag: Bag, items: Item[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(["bags", "items"], "readwrite");

  await tx.objectStore("bags").put(bag);

  for (const item of items) {
    await tx.objectStore("items").put(item);
  }

  await tx.done;
}

// Bulk operations for import
export async function importData(bags: Bag[], items: Item[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(["bags", "items"], "readwrite");
  // Clear existing
  await tx.objectStore("bags").clear();
  await tx.objectStore("items").clear();
  for (const bag of bags) {
    await tx.objectStore("bags").put(bag);
  }
  for (const item of items) {
    await tx.objectStore("items").put(item);
  }
  await tx.done;
}
