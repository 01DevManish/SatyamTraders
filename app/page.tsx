import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import ProductListing from "./components/Product/ProductListing";
import { getProducts, getCategories, getCollections } from "@/lib/data";
import Link from "next/link";

export const metadata = {
  title: "Buy Bed Sheets Online | Up to 70% Off — Satyam Trders",
  description: "Shop premium single, double & king-size cotton bed sheets, comforters & towels. Up to 70% off. Direct from Satyam Trders.",
};

export default async function Home() {
  const allProducts = await getProducts();
  const categories = await getCategories();
  const collections = await getCollections();

  const homeProducts = allProducts.slice(0, 12);

  return (
    <main className="main-viewport">
      <Header categories={categories} collections={collections} />
      <Hero />
      
      {/* ===== CONTENT — 20px side margin, header/footer excluded ===== */}
      <div style={{ padding: "0 20px" }}>

      {/* Category Strip */}
      <div className="cat-strip hide-scrollbar">
        {categories.map((cat) => (
          <div key={cat.id} className="cat-strip-item">
            <div className="cat-strip-img">
              <img src={cat.image} alt={cat.name} />
            </div>
            <span>{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Product Grid */}
      <div className="container section" style={{ paddingTop: "0" }}>
        <ProductListing initialProducts={homeProducts} />
      </div>

      </div>{/* end content-wrap */}

      {/* Trust Strip — single elegant dark card row */}
      <section className="trust-strip">
        <div className="container">
          <div className="trust-strip-inner">
            <div className="trust-strip-item">
              <div className="trust-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="trust-text">
                <h4>Quality Assured</h4>
                <p>Every product handpicked for quality</p>
              </div>
            </div>

            <div className="trust-strip-item">
              <div className="trust-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
              </div>
              <div className="trust-text">
                <h4>Easy Exchanges</h4>
                <p>15-day easy exchange policy</p>
              </div>
            </div>

            <div className="trust-strip-item">
              <div className="trust-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div className="trust-text">
                <h4>Secure Payment</h4>
                <p>100% secure payment processing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h1 className="logo-text" style={{ marginBottom: "16px", fontSize: "22px" }}>Satyam Trders</h1>
              <p className="footer-text">
                Satyam Trders redefines premium home living with handcrafted bedding and decor, 
                delivered direct to you.
              </p>
              <div className="contact-info">
                <h4 className="footer-h" style={{ marginBottom: "14px" }}>Get in Touch</h4>
                <div className="contact-item">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <span>
                    Anand Parvat, New Delhi - 110005
                  </span>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <span>7011289943</span>
                </div>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-h">Collections</h4>
              <ul className="footer-links-list">
                {collections.slice(0, 8).map(c => (
                  <li key={c}>
                    <Link href={`/collection/${c.toLowerCase().replace(/\s+/g, '-')}`}>{c}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-h">Information</h4>
              <ul className="footer-links-list">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Return &amp; Exchange Policy</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            © 2024 Satyam Trders. All Rights Reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
