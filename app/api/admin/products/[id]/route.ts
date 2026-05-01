import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-guard";
import { deleteStoredProduct, updateStoredProduct } from "@/lib/product-store";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const payload = await request.json();

    const updated = await updateStoredProduct(id, {
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

    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json([updated]);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteStoredProduct(id);

    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
