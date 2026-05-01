import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-guard";
import { createStoredProduct, listStoredProducts } from "@/lib/product-store";

export async function GET(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await listStoredProducts();
    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const created = await createStoredProduct({
      name: payload.name,
      price: Number(payload.price || 0),
      originalPrice:
        payload.originalPrice != null && payload.originalPrice !== ""
          ? Number(payload.originalPrice)
          : undefined,
      image: payload.image || "",
      category: payload.category || "General",
      collection: payload.collection || "General",
      stock: Number(payload.stock || 0),
      sku: payload.sku || undefined,
      sizes: Array.isArray(payload.sizes)
        ? payload.sizes
        : typeof payload.sizes === "string"
          ? payload.sizes.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [],
      status: payload.status === "inactive" ? "inactive" : "active",
    });

    return NextResponse.json([created], { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
