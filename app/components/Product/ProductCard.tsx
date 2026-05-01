"use client";

import { useState } from "react";
import { getImageUrl } from "@/lib/image";
import ProductModal from "./ProductModal";

interface ProductProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  collection?: string;
  isNew?: boolean;
  saleTag?: string;
  sku?: string;
  sizes?: string[];
}

export default function ProductCard(props: ProductProps) {
  const { name, price, originalPrice, image, isNew } = props;
  const [showModal, setShowModal] = useState(false);

  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  return (
    <>
      <div className="v-card">
        {/* Image */}
        <div className="v-card-img-wrapper">
          <img
            src={getImageUrl(image)}
            alt={name}
            className="v-card-img"
            loading="lazy"
          />

          {/* Wishlist */}
          <div className="v-card-wishlist" role="button" aria-label="Add to wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.89-8.89 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>

          {/* Badges */}
          <div className="v-card-badges">
            {discount > 0 && (
              <div className="v-badge v-badge-discount">{discount}% OFF</div>
            )}
            {isNew && <div className="v-badge v-badge-new">NEW</div>}
          </div>
        </div>

        {/* Info */}
        <div className="v-card-info">
          <h3 className="v-card-title">{name}</h3>
          <div className="v-card-price-row">
            <span className="v-price-current">₹{price.toLocaleString()}</span>
            {originalPrice && originalPrice > price && (
              <span className="v-price-original">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}
            {discount > 0 && (
              <span className="v-price-off">{discount}% off</span>
            )}
          </div>
        </div>

        {/* Add to Cart */}
        <div className="v-card-actions">
          <button
            className="v-add-to-cart-btn"
            onClick={() => setShowModal(true)}
            aria-label={`Add ${name} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product detail modal — opens on Add to Cart click */}
      {showModal && (
        <ProductModal product={props} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
