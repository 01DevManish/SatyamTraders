"use client";

import { useMemo, useState } from "react";
import "./admin.css";

type Product = {
  id: string;
  name: string;
  price: number;
  original_price?: number | null;
  image: string;
  category: string;
  collection: string;
  stock: number;
  sku?: string | null;
  sizes?: string[];
  status: string;
};

type ApiError = { error?: string };

const emptyForm = {
  id: "",
  name: "",
  price: "",
  originalPrice: "",
  image: "",
  category: "",
  collection: "",
  stock: "",
  sku: "",
  sizes: "",
  status: "active",
};

export default function AdminClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);

  const isEditing = useMemo(() => Boolean(form.id), [form.id]);

  async function loadProducts() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/admin/products", { cache: "no-store" });
      const data: Product[] | ApiError = await res.json();
      if (!res.ok) throw new Error(!Array.isArray(data) ? data.error || "Failed to load" : "Failed to load");

      setProducts(Array.isArray(data) ? data : []);
      setLoaded(true);
      setMessage("Products loaded");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  function editItem(item: Product) {
    setError("");
    setMessage("Editing product");
    setForm({
      id: item.id,
      name: item.name || "",
      price: String(item.price ?? ""),
      originalPrice: item.original_price != null ? String(item.original_price) : "",
      image: item.image || "",
      category: item.category || "",
      collection: item.collection || "",
      stock: String(item.stock ?? 0),
      sku: item.sku || "",
      sizes: Array.isArray(item.sizes) ? item.sizes.join(", ") : "",
      status: item.status || "active",
    });
  }

  function resetForm() {
    setForm(emptyForm);
    setMessage("Form reset");
    setError("");
  }

  async function onUpload(file: File) {
    setUploading(true);
    setError("");
    setMessage("");

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("prefix", "inventory/images/products/");

      const res = await fetch("/api/drive?action=upload", {
        method: "POST",
        body: fd,
      });

      const data: { error?: string; url?: string; provider?: string } = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Image upload failed");

      setForm((prev) => ({ ...prev, image: data.url || "" }));
      setMessage(`Image uploaded (${data.provider || "storage"})`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      name: form.name,
      price: form.price,
      originalPrice: form.originalPrice,
      image: form.image,
      category: form.category,
      collection: form.collection,
      stock: form.stock,
      sku: form.sku,
      sizes: form.sizes,
      status: form.status,
    };

    try {
      const res = await fetch(isEditing ? `/api/admin/products/${form.id}` : "/api/admin/products", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: Product[] | ApiError = await res.json();
      if (!res.ok) throw new Error(!Array.isArray(data) ? data.error || "Save failed" : "Save failed");

      setMessage(isEditing ? "Product updated" : "Product added");
      resetForm();
      await loadProducts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id: string) {
    const ok = window.confirm("Delete this product?");
    if (!ok) return;

    setError("");
    setMessage("");

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data: ApiError = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");

      if (form.id === id) resetForm();
      setMessage("Product deleted");
      await loadProducts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <main className="adminRoot">
      <div className="topBar">
        <h1 className="title">Satyam Trders Admin Panel</h1>
        <button type="button" className="btn" onClick={() => void logout()}>Logout</button>
      </div>
      <p className="sub">Products add, update, delete aur image upload yahin se hoga.</p>

      {message ? <p className="msg ok">{message}</p> : null}
      {error ? <p className="msg err">{error}</p> : null}

      <div className="grid">
        <section className="card">
          <h2 className="cardTitle">Product Form</h2>
          <form onSubmit={submitForm} className="formGrid">
            <input className="input full" required placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input" required placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input className="input" placeholder="Original Price" type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} />

            <input className="input full" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            {form.image ? <img src={form.image} alt="Preview" className="imagePreview" /> : null}
            <input className="input full" type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) void onUpload(file); }} />
            {uploading ? <small className="full">Uploading image...</small> : null}

            <input className="input" required placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <input className="input" required placeholder="Collection" value={form.collection} onChange={(e) => setForm({ ...form, collection: e.target.value })} />
            <input className="input" placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            <input className="input" placeholder="Sizes (comma separated)" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
            <input className="input" required placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>

            <div className="row full">
              <button className="btn btnPrimary" type="submit" disabled={saving || uploading}>{saving ? "Saving..." : isEditing ? "Update Product" : "Add Product"}</button>
              <button className="btn" type="button" onClick={resetForm}>Reset</button>
              {!loaded ? <button className="btn" type="button" onClick={() => void loadProducts()} disabled={loading}>{loading ? "Loading..." : "Load Products"}</button> : null}
            </div>
          </form>
        </section>

        <section className="card">
          <h2 className="cardTitle">Products</h2>
          {!loaded ? <p className="meta">Click Load Products to fetch list.</p> : null}
          {loaded && loading ? <p className="meta">Loading...</p> : null}

          {loaded && !loading ? (
            <div className="list">
              {products.map((p) => (
                <div key={p.id} className="item">
                  <div>
                    <p className="name">{p.name}</p>
                    <p className="meta">Rs {Number(p.price || 0).toLocaleString()} | Stock: {p.stock} | {p.status}</p>
                    <p className="meta">{p.category} / {p.collection}</p>
                  </div>
                  <div className="row">
                    <button className="btn" type="button" onClick={() => editItem(p)}>Edit</button>
                    <button className="btn btnDanger" type="button" onClick={() => void deleteProduct(p.id)}>Delete</button>
                  </div>
                </div>
              ))}
              {products.length === 0 ? <p className="meta">No products found.</p> : null}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
