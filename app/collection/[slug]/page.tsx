import Header from "../../components/Header/Header";
import ProductListing from "../../components/Product/ProductListing";
import { getProductsByCollection, getCategories, getCollections } from "@/lib/data";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const products    = await getProductsByCollection(slug);
  const categories  = await getCategories();
  const collections = await getCollections();

  const displayName =
    products.length > 0
      ? products[0].collection
      : slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <main className="main-viewport">
      <Header categories={categories} collections={collections} />

      <div style={{ padding: "0 20px" }}>
        <div className="container section">
          {/* Page heading */}
          <div className="collection-header-page">
            <h1 className="collection-page-title">{displayName}</h1>
            <p className="collection-page-count">
              {products.length} {products.length === 1 ? "Product" : "Products"} Found
            </p>
            <div className="gold-divider" style={{ marginTop: "12px" }} />
          </div>

          {products.length > 0 ? (
            <ProductListing
              initialProducts={products}
              hideCollectionFilter={true}
            />
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "80px 0",
                color: "var(--text-muted)",
              }}
            >
              <p style={{ fontSize: "18px", marginBottom: "8px" }}>
                No products in this collection yet.
              </p>
              <p style={{ fontSize: "13px" }}>Check back soon!</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-bottom" style={{ paddingTop: 0, borderTop: "none" }}>
            © 2024 Satyam Trders. All Rights Reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
