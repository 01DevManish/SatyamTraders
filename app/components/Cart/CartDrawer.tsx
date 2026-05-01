"use client";

import { useCart } from "@/app/context/CartContext";
import { getImageUrl } from "@/lib/image";
import Link from "next/link";

export default function CartDrawer() {
  const { items, removeFromCart, updateQty, cartTotal, cartCount, isCartOpen, closeCart } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={closeCart} />

      {/* Drawer */}
      <div className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping Cart">
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-wrap">
            <span className="cart-drawer-title">Your Cart</span>
            {cartCount > 0 && (
              <span className="cart-drawer-badge">{cartCount}</span>
            )}
          </div>
          <button className="modal-close" onClick={closeCart} aria-label="Close cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="1.2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <p className="cart-empty-title">Your cart is empty</p>
              <p className="cart-empty-sub">Add premium products to get started</p>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="cart-item">
                  <div className="cart-item-img-wrap">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="cart-item-img"
                    />
                  </div>
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-size">Size: {item.size}</p>
                    <div className="cart-item-bottom">
                      {/* Qty stepper */}
                      <div className="cart-qty-stepper">
                        <button
                          className="cart-qty-btn"
                          onClick={() => updateQty(item.id, item.size, -1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="cart-qty-count">{item.quantity}</span>
                        <button
                          className="cart-qty-btn"
                          onClick={() => updateQty(item.id, item.size, 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <span className="cart-item-price">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {/* Remove */}
                  <button
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item.id, item.size)}
                    aria-label="Remove item"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-row">
              <span className="cart-summary-label">Subtotal ({cartCount} items)</span>
              <span className="cart-summary-total">₹{cartTotal.toLocaleString()}</span>
            </div>
            <p className="cart-summary-note">Taxes and shipping calculated at checkout</p>
            <Link
              href="/checkout"
              className="cart-checkout-btn"
              onClick={closeCart}
            >
              Proceed to Checkout
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
