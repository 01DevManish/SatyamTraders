"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";

interface ProductListingProps {
  initialProducts: any[];
  /** Pass true on collection pages so "All collections" dropdown is hidden */
  hideCollectionFilter?: boolean;
}

export default function ProductListing({
  initialProducts,
  hideCollectionFilter = false,
}: ProductListingProps) {
  const [searchTerm, setSearchTerm]           = useState("");
  const [sizeFilter, setSizeFilter]           = useState("");
  const [collectionFilter, setCollectionFilter] = useState("");
  const [categoryFilter, setCategoryFilter]   = useState("");

  // ---- Derive unique options from product data ----
  const allSizes = [
    ...new Set(
      initialProducts
        .flatMap((p) => p.sizes ?? [])
        .filter(Boolean)
    ),
  ].sort();

  const collections = [
    ...new Set(initialProducts.map((p) => p.collection).filter(Boolean)),
  ].sort();

  const categories = [
    ...new Set(initialProducts.map((p) => p.category).filter(Boolean)),
  ].sort();

  // ---- Filter logic ----
  const filteredProducts = initialProducts
    .filter((p) => {
      const matchesSearch =
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCollection =
        !collectionFilter || p.collection === collectionFilter;

      const matchesCategory =
        !categoryFilter || p.category === categoryFilter;

      const matchesSize =
        !sizeFilter ||
        (Array.isArray(p.sizes) && p.sizes.includes(sizeFilter));

      return matchesSearch && matchesCollection && matchesCategory && matchesSize;
    })
    .slice(0, 48); // show up to 48 on listing; 12 on homepage

  const hasActiveFilter =
    searchTerm || sizeFilter || collectionFilter || categoryFilter;

  const clearAll = () => {
    setSearchTerm("");
    setSizeFilter("");
    setCollectionFilter("");
    setCategoryFilter("");
  };

  return (
    <div className="product-listing-section">
      {/* ========= FILTER BAR ========= */}
      <div className="listing-filters">
        {/* Search — bigger */}
        <div className="filter-search filter-search-lg">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--gold-mid)" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search Bedding, Comforter and Towels"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search products"
          />
          {searchTerm && (
            <button className="search-clear-btn" onClick={() => setSearchTerm("")} aria-label="Clear search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Dropdown filters */}
        <div className="filter-selects">
          {/* Size */}
          {allSizes.length > 0 && (
            <div className="filter-select-wrap">
              <select
                className="filter-select"
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                aria-label="Filter by size"
              >
                <option value="">All Sizes</option>
                {allSizes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <span className="filter-select-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
          )}

          {/* Collection */}
          {!hideCollectionFilter && collections.length > 0 && (
            <div className="filter-select-wrap">
              <select
                className="filter-select"
                value={collectionFilter}
                onChange={(e) => setCollectionFilter(e.target.value)}
                aria-label="Filter by collection"
              >
                <option value="">All Collections</option>
                {collections.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <span className="filter-select-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
          )}

          {/* Category */}
          {categories.length > 0 && (
            <div className="filter-select-wrap">
              <select
                className="filter-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter by category"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <span className="filter-select-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
          )}

          {/* Clear */}
          {hasActiveFilter && (
            <button className="filter-clear-btn" onClick={clearAll}>
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      {hasActiveFilter && (
        <p className="listing-result-count">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* ========= GRID ========= */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))
        ) : (
          <div className="no-results">
            <p style={{ fontSize: "16px", marginBottom: "6px" }}>
              No products found.
            </p>
            <p style={{ fontSize: "13px" }}>
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
