import fs from "node:fs/promises";
import path from "node:path";

const filePath = path.join(process.cwd(), "scratch", "products.json");

export type StoredProduct = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  collection: string;
  stock: number;
  sku?: string;
  sizes?: string[];
  status: "active" | "inactive";
  createdAt: number;
};

async function ensureFile() {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]", "utf8");
  }
}

async function readAll(): Promise<StoredProduct[]> {
  await ensureFile();
  const raw = await fs.readFile(filePath, "utf8");
  const arr = JSON.parse(raw) as StoredProduct[];
  return Array.isArray(arr) ? arr : [];
}

async function writeAll(items: StoredProduct[]) {
  await ensureFile();
  await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf8");
}

export async function listStoredProducts(): Promise<StoredProduct[]> {
  const items = await readAll();
  return items.sort((a, b) => b.createdAt - a.createdAt);
}

export async function createStoredProduct(input: Partial<StoredProduct>): Promise<StoredProduct> {
  const items = await readAll();
  const created: StoredProduct = {
    id: crypto.randomUUID(),
    name: String(input.name || "Product"),
    price: Number(input.price || 0),
    originalPrice:
      input.originalPrice != null && Number.isFinite(Number(input.originalPrice))
        ? Number(input.originalPrice)
        : undefined,
    image: String(input.image || ""),
    category: String(input.category || "General"),
    collection: String(input.collection || "General"),
    stock: Number(input.stock || 0),
    sku: input.sku ? String(input.sku) : undefined,
    sizes: Array.isArray(input.sizes) ? input.sizes.map(String) : [],
    status: input.status === "inactive" ? "inactive" : "active",
    createdAt: Date.now(),
  };

  items.unshift(created);
  await writeAll(items);
  return created;
}

export async function updateStoredProduct(id: string, input: Partial<StoredProduct>): Promise<StoredProduct | null> {
  const items = await readAll();
  const idx = items.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  const prev = items[idx];
  const updated: StoredProduct = {
    ...prev,
    name: input.name != null ? String(input.name) : prev.name,
    price: input.price != null ? Number(input.price) : prev.price,
    originalPrice:
      input.originalPrice != null && Number.isFinite(Number(input.originalPrice))
        ? Number(input.originalPrice)
        : prev.originalPrice,
    image: input.image != null ? String(input.image) : prev.image,
    category: input.category != null ? String(input.category) : prev.category,
    collection: input.collection != null ? String(input.collection) : prev.collection,
    stock: input.stock != null ? Number(input.stock) : prev.stock,
    sku: input.sku != null ? String(input.sku) : prev.sku,
    sizes: Array.isArray(input.sizes) ? input.sizes.map(String) : prev.sizes,
    status: input.status === "inactive" ? "inactive" : input.status === "active" ? "active" : prev.status,
  };

  items[idx] = updated;
  await writeAll(items);
  return updated;
}

export async function deleteStoredProduct(id: string): Promise<boolean> {
  const items = await readAll();
  const next = items.filter((p) => p.id !== id);
  if (next.length === items.length) return false;
  await writeAll(next);
  return true;
}
