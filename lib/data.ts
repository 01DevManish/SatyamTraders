import { listStoredProducts } from "@/lib/product-store";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  collection: string;
  stock: number;
  createdAt: number;
  isNew?: boolean;
  saleTag?: string;
  sku?: string;
  sizes?: string[];
  status?: string;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const rows = await listStoredProducts();
    return rows
      .filter((r) => r.status === "active")
      .map((r) => ({
        id: r.id,
        name: r.name,
        price: r.price,
        originalPrice: r.originalPrice,
        image: r.image,
        category: r.category,
        collection: r.collection,
        stock: r.stock,
        createdAt: r.createdAt,
        isNew: Date.now() - r.createdAt < 30 * 24 * 60 * 60 * 1000,
        sku: r.sku,
        sizes: r.sizes,
        status: r.status,
      }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductsByCollection(collectionSlug: string): Promise<Product[]> {
  const allProducts = await getProducts();
  return allProducts.filter(
    (p) => p.collection.toLowerCase().replace(/\s+/g, "-") === collectionSlug.toLowerCase()
  );
}

export async function getCategories() {
  const products = await getProducts();
  const categoryNames = [...new Set(products.map((p) => p.category))].filter(Boolean);

  const categoryImages: { [key: string]: string } = {
    BEDSHEET: "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=400",
    TOWEL: "https://images.unsplash.com/photo-1621328078696-6d6f519393a5?w=400",
    COMFORTER: "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=400",
  };

  return categoryNames.map((name, index) => ({
    id: index + 1,
    name,
    image:
      categoryImages[name] ||
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200&h=200&fit=crop",
  }));
}

export async function getCollections() {
  const products = await getProducts();
  return [...new Set(products.map((p) => p.collection))].filter(Boolean);
}
