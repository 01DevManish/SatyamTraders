"use client";

import { useState } from "react";
import { getImageUrl } from "@/lib/image";
import { useCart } from "@/app/context/CartContext";

// Default sizes shown when DynamoDB has no size data
const FALLBACK_SIZES = ["Single", "Double", "Queen", "King"];

interface ProductModalProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    collection?: string;
    sku?: string;
    sizes?: string[];
  };
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useCart();

  // Use sizes from DynamoDB; fall back to standard options
  const availableSizes = product.sizes && product.sizes.length > 0
    ? product.sizes
    : FALLBACK_SIZES;

  const [selectedSize, setSelectedSize] = useState(availableSizes[0] ?? "");
  const [added, setAdded] = useState(false);

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose(); // close product modal; cart drawer opens automatically
    }, 900);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onClose} />

      {/* Slide-in Panel */}
      <div
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
      >
        {/* Header */}
        <div className="modal-header">
          <span className="modal-header-title">Product Details</span>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="modal-product-img"
          />

          <div className="modal-product-info">
            {/* Name + SKU */}
            <h2 className="modal-product-name">{product.name}</h2>
            {product.sku && (
              <p className="modal-sku">SKU: {product.sku}</p>
            )}

            {/* Price block */}
            <div className="modal-price-block">
              <span className="modal-price-current">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="modal-price-original">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
              {discount > 0 && (
                <span className="modal-price-badge">{discount}% OFF</span>
              )}
            </div>

            {/* Meta table */}
            <table className="modal-meta-table">
              <tbody>
                <tr>
                  <td className="modal-meta-label">Category</td>
                  <td className="modal-meta-value">{product.category}</td>
                </tr>
                {product.collection && (
                  <tr>
                    <td className="modal-meta-label">Collection</td>
                    <td className="modal-meta-value">{product.collection}</td>
                  </tr>
                )}
                {product.sku && (
                  <tr>
                    <td className="modal-meta-label">SKU</td>
                    <td className="modal-meta-value">{product.sku}</td>
                  </tr>
                )}
                {discount > 0 && (
                  <tr>
                    <td className="modal-meta-label">Discount</td>
                    <td
                      className="modal-meta-value"
                      style={{ color: "var(--sale-badge)", fontWeight: 700 }}
                    >
                      Save ₹
                      {(product.originalPrice! - product.price).toLocaleString()}{" "}
                      ({discount}% OFF)
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="modal-meta-label">MRP</td>
                  <td className="modal-meta-value">
                    ₹
                    {(
                      product.originalPrice || product.price
                    ).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>

            <hr className="modal-divider" />

            {/* Size Selection — from DynamoDB or fallback */}
            <p className="modal-section-label">
              Select Size
              {!(product.sizes && product.sizes.length > 0) && (
                <span style={{ fontWeight: 400, textTransform: "none", marginLeft: 6, color: "var(--text-muted)", fontSize: "11px" }}>
                  (standard options)
                </span>
              )}
            </p>
            <div className="size-options">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  className={`size-chip ${selectedSize === size ? "selected" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            className="modal-add-btn"
            onClick={handleAddToCart}
            disabled={added}
          >
            {added ? (
              <>
                <svg
                  style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Added!
              </>
            ) : (
              `Add to Cart — ₹${product.price.toLocaleString()}`
            )}
          </button>
          <button className="modal-wishlist-btn" aria-label="Add to Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.89-8.89 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
