"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";

interface HeaderProps {
  categories: { name: string }[];
  collections: string[];
}

export default function Header({ categories, collections }: HeaderProps) {
  const [search, setSearch] = useState("");
  const { cartCount, openCart } = useCart();

  return (
    <header className="header-wrapper">
      {/* Promo Bar */}
      <div className="top-promo-bar">
        Buy Single, Double &amp; Premium Cotton Bed Sheets Online | Up to 70% off
      </div>

      {/* Main Header */}
      <div className="main-header">
        <div className="container header-grid">
          {/* Logo */}
          <div className="logo-container">
            <Link href="/" className="logo">
              <span className="logo-text">SATYAM TRDERS</span>
            </Link>
          </div>

          {/* Search */}
          <div className="search-container">
            <div className="search-box">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--gold-mid)" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search Bedding, Comforter and Towels"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search products"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="header-actions">
            <div className="action-item" role="button" tabIndex={0}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="icon-label">Profile</span>
            </div>

            <div className="action-item" role="button" tabIndex={0}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.89-8.89 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className="icon-label">Wishlist</span>
            </div>

            {/* Cart — live count + opens drawer */}
            <div
              className="action-item"
              role="button"
              tabIndex={0}
              onClick={openCart}
              onKeyDown={(e) => e.key === "Enter" && openCart()}
              style={{ cursor: "pointer" }}
            >
              <div className="cart-badge-container">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount > 9 ? "9+" : cartCount}</span>
                )}
              </div>
              <span className="icon-label">Cart</span>
            </div>
          </div>
        </div>
      </div>

      {/* Collections Nav */}
      <nav className="collections-nav" aria-label="Product collections">
        <ul className="collections-list hide-scrollbar">
          {collections.map((col) => (
            <li key={col} className="collection-item">
              <Link href={`/collection/${col.toLowerCase().replace(/\s+/g, "-")}`}>
                {col}
              </Link>
            </li>
          ))}
          <li className="collection-item">
            <Link
              href="/all"
              style={{ color: "var(--gold-mid)" }}
            >
              SHOP ALL
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
