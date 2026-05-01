"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { getImageUrl } from "@/lib/image";

type PaymentMethod = "card" | "gpay" | "phonepe" | "paytm";

export default function CheckoutPage() {
  const { items, cartTotal, cartCount } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [placed, setPlaced] = useState(false);

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "",
    address: "", city: "", state: "", pincode: "",
    cardNumber: "", cardName: "", expiry: "", cvv: "",
    upiId: "",
  });

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const shippingFee = cartTotal > 999 ? 0 : 99;
  const grandTotal  = cartTotal + shippingFee;

  if (placed) {
    return (
      <div className="checkout-success-screen">
        <div className="checkout-success-card">
          <div className="checkout-success-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="checkout-success-title">Order Placed!</h1>
          <p className="checkout-success-sub">
            Thank you{form.fullName ? `, ${form.fullName}` : ""}! Your order has been confirmed
            {form.city ? ` and will be delivered to ${form.city}` : ""} shortly.
          </p>
          <p className="checkout-success-amount">
            Total Paid: <strong>₹{grandTotal.toLocaleString()}</strong>
          </p>
          <Link href="/" className="checkout-success-btn">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* ── Top Bar ── */}
      <header className="checkout-topbar">
        <Link href="/" className="checkout-logo">SATYAM TRDERS</Link>
        <span className="checkout-step-label">Secure Checkout</span>
        <div className="checkout-secure-badge">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          SSL Secured
        </div>
      </header>

      <div className="checkout-layout">
        {/* ══════════ LEFT ══════════ */}
        <div className="checkout-left">

          {/* Section 1 — Delivery */}
          <section className="checkout-section">
            <div className="checkout-section-header">
              <div className="checkout-section-num">1</div>
              <h2 className="checkout-section-title">Delivery Information</h2>
            </div>

            <div className="checkout-form-grid">
              <div className="checkout-field checkout-field-full">
                <label>Full Name</label>
                <input placeholder="Name"
                  value={form.fullName} onChange={e => set("fullName", e.target.value)} />
              </div>
              <div className="checkout-field">
                <label>Email</label>
                <input placeholder="Email" type="email"
                  value={form.email} onChange={e => set("email", e.target.value)} />
              </div>
              <div className="checkout-field">
                <label>Phone</label>
                <input placeholder="Phone" type="tel"
                  value={form.phone} onChange={e => set("phone", e.target.value)} />
              </div>
              <div className="checkout-field checkout-field-full">
                <label>Address</label>
                <input placeholder="Address"
                  value={form.address} onChange={e => set("address", e.target.value)} />
              </div>
              <div className="checkout-field">
                <label>City</label>
                <input placeholder="City"
                  value={form.city} onChange={e => set("city", e.target.value)} />
              </div>
              <div className="checkout-field">
                <label>State</label>
                <input placeholder="State"
                  value={form.state} onChange={e => set("state", e.target.value)} />
              </div>
              <div className="checkout-field">
                <label>Pincode</label>
                <input placeholder="Pincode" maxLength={6}
                  value={form.pincode} onChange={e => set("pincode", e.target.value)} />
              </div>
            </div>
          </section>

          {/* Section 2 — Payment */}
          <section className="checkout-section">
            <div className="checkout-section-header">
              <div className="checkout-section-num">2</div>
              <h2 className="checkout-section-title">Payment Method</h2>
            </div>

            {/* ── Payment Tabs ── */}
            <div className="payment-methods-grid">

              {/* Card */}
              <button className={`payment-method-tab ${paymentMethod === "card" ? "active" : ""}`}
                onClick={() => setPaymentMethod("card")}>
                <div className="pm-logo-wrap">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.6">
                    <rect x="1" y="4" width="22" height="16" rx="3" ry="3"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                    <line x1="5" y1="15" x2="9" y2="15"/>
                  </svg>
                </div>
                <span>Card</span>
              </button>

              {/* Google Pay */}
              <button className={`payment-method-tab ${paymentMethod === "gpay" ? "active" : ""}`}
                onClick={() => setPaymentMethod("gpay")}>
                <div className="pm-logo-wrap">
                  {/* Official Google Pay G-mark colours */}
                  <svg width="32" height="32" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M43.6 20.1H42V20H24v8h11.3C33.9 32.3 29.4 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.5 7.1 29 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4.9z" fill="#FFC107"/>
                    <path d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.5 7.1 29 5 24 5c-7.6 0-14.2 4.3-17.7 9.7z" fill="#FF3D00"/>
                    <path d="M24 45c4.9 0 9.3-1.8 12.7-4.8l-5.9-5c-1.7 1.4-3.9 2.3-6.8 2.3-5.4 0-9.9-3.6-11.4-8.5L6.3 34c3.4 5.5 9.8 11 17.7 11z" fill="#4CAF50"/>
                    <path d="M43.6 20.1H42V20H24v8h11.3c-.7 2-2 3.8-3.7 5h.1l5.9 5C37 37.4 44 32 44 25c0-1.3-.1-2.7-.4-4.9z" fill="#1976D2"/>
                  </svg>
                </div>
                <span>Google Pay</span>
              </button>

              {/* PhonePe */}
              <button className={`payment-method-tab ${paymentMethod === "phonepe" ? "active" : ""}`}
                onClick={() => setPaymentMethod("phonepe")}>
                <div className="pm-logo-wrap">
                  {/* PhonePe purple brand */}
                  <div className="pm-phonepe-logo">
                    <svg width="28" height="28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100" height="100" rx="22" fill="#5f259f"/>
                      <text x="50" y="70" textAnchor="middle" fill="#fff"
                        fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="58">
                        Pe
                      </text>
                    </svg>
                  </div>
                </div>
                <span>PhonePe</span>
              </button>

              {/* Paytm */}
              <button className={`payment-method-tab ${paymentMethod === "paytm" ? "active" : ""}`}
                onClick={() => setPaymentMethod("paytm")}>
                <div className="pm-logo-wrap">
                  {/* Paytm brand: dark navy + cyan accent */}
                  <div className="pm-paytm-logo">
                    <svg width="54" height="24" viewBox="0 0 140 56" xmlns="http://www.w3.org/2000/svg">
                      <rect width="140" height="56" rx="8" fill="#002970"/>
                      <text x="10" y="40" fill="#00BAF2" fontFamily="Arial, sans-serif"
                        fontWeight="900" fontSize="38" letterSpacing="-1">
                        pay
                      </text>
                      <text x="74" y="40" fill="#ffffff" fontFamily="Arial, sans-serif"
                        fontWeight="900" fontSize="38" letterSpacing="-1">
                        tm
                      </text>
                    </svg>
                  </div>
                </div>
                <span>Paytm</span>
              </button>
            </div>

            {/* ── Card Form ── */}
            {paymentMethod === "card" && (
              <div className="payment-detail-form">
                <div className="checkout-field checkout-field-full" style={{ marginBottom: 14 }}>
                  <label>Card Number</label>
                  <div className="card-input-wrap">
                    <input
                      placeholder="Card Number"
                      maxLength={19}
                      value={form.cardNumber}
                      onChange={e => {
                        const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                        const fmt = raw.replace(/(.{4})/g, "$1  ").trim();
                        set("cardNumber", fmt);
                      }}
                    />
                    <div className="card-network-icons">
                      <span className="card-chip visa">VISA</span>
                      <span className="card-chip mc">MC</span>
                    </div>
                  </div>
                </div>
                <div className="checkout-field checkout-field-full" style={{ marginBottom: 14 }}>
                  <label>Name on Card</label>
                  <input placeholder="Name on Card"
                    value={form.cardName} onChange={e => set("cardName", e.target.value)} />
                </div>
                <div className="checkout-form-grid" style={{ marginBottom: 14 }}>
                  <div className="checkout-field">
                    <label>Expiry</label>
                    <input placeholder="MM / YY" maxLength={7}
                      value={form.expiry}
                      onChange={e => {
                        let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                        if (v.length >= 3) v = v.slice(0, 2) + " / " + v.slice(2);
                        set("expiry", v);
                      }} />
                  </div>
                  <div className="checkout-field">
                    <label>CVV</label>
                    <input placeholder="CVV" maxLength={4} type="password"
                      value={form.cvv} onChange={e => set("cvv", e.target.value)} />
                  </div>
                </div>
                <div className="card-secure-note">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Your card details are 256-bit encrypted and secure
                </div>
              </div>
            )}

            {/* ── UPI Panel (shared for GPay / PhonePe / Paytm) ── */}
            {(paymentMethod === "gpay" || paymentMethod === "phonepe" || paymentMethod === "paytm") && (
              <div className="payment-detail-form">
                <div className="upi-info-card">
                  {/* Brand header */}
                  <div className="upi-brand-header">
                    {paymentMethod === "gpay" && (
                      <div className="upi-brand-logo">
                        <svg width="36" height="36" viewBox="0 0 48 48">
                          <path d="M43.6 20.1H42V20H24v8h11.3C33.9 32.3 29.4 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.5 7.1 29 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4.9z" fill="#FFC107"/>
                          <path d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.5 7.1 29 5 24 5c-7.6 0-14.2 4.3-17.7 9.7z" fill="#FF3D00"/>
                          <path d="M24 45c4.9 0 9.3-1.8 12.7-4.8l-5.9-5c-1.7 1.4-3.9 2.3-6.8 2.3-5.4 0-9.9-3.6-11.4-8.5L6.3 34c3.4 5.5 9.8 11 17.7 11z" fill="#4CAF50"/>
                          <path d="M43.6 20.1H42V20H24v8h11.3c-.7 2-2 3.8-3.7 5h.1l5.9 5C37 37.4 44 32 44 25c0-1.3-.1-2.7-.4-4.9z" fill="#1976D2"/>
                        </svg>
                        <span style={{ fontWeight: 700, fontSize: 18, marginLeft: 10 }}>Google Pay</span>
                      </div>
                    )}
                    {paymentMethod === "phonepe" && (
                      <div className="upi-brand-logo" style={{ color: "#5f259f" }}>
                        <svg width="36" height="36" viewBox="0 0 100 100">
                          <rect width="100" height="100" rx="22" fill="#5f259f"/>
                          <text x="50" y="70" textAnchor="middle" fill="#fff"
                            fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="58">Pe</text>
                        </svg>
                        <span style={{ fontWeight: 700, fontSize: 18, marginLeft: 10, color: "#5f259f" }}>PhonePe</span>
                      </div>
                    )}
                    {paymentMethod === "paytm" && (
                      <div className="upi-brand-logo">
                        <svg width="80" height="34" viewBox="0 0 140 56">
                          <rect width="140" height="56" rx="8" fill="#002970"/>
                          <text x="10" y="40" fill="#00BAF2" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="38" letterSpacing="-1">pay</text>
                          <text x="74" y="40" fill="#ffffff" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="38" letterSpacing="-1">tm</text>
                        </svg>
                      </div>
                    )}
                  </div>

                  <p className="upi-instruction">
                    {paymentMethod === "gpay"    && "Enter your Google Pay UPI ID to complete payment"}
                    {paymentMethod === "phonepe" && "Enter your PhonePe UPI ID to complete payment"}
                    {paymentMethod === "paytm"   && "Enter your Paytm UPI ID or registered mobile number"}
                  </p>

                  <div className="checkout-field checkout-field-full">
                    <label>UPI ID {paymentMethod === "paytm" ? "/ Mobile" : ""}</label>
                    <div className="upi-input-wrap">
                      <input
                        placeholder={
                          paymentMethod === "gpay"    ? "yourname@okaxis" :
                          paymentMethod === "phonepe" ? "yourname@ybl"    :
                                                        "yourname@paytm"
                        }
                        value={form.upiId}
                        onChange={e => set("upiId", e.target.value)}
                      />
                      <span className="upi-at">@</span>
                    </div>
                  </div>

                  <div className="upi-secure-row">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    UPI payments are secured by NPCI
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* ══════════ RIGHT: ORDER SUMMARY ══════════ */}
        <div className="checkout-right">
          <div className="order-summary-card">
            <h3 className="order-summary-title">Order Summary</h3>
            <div className="order-summary-divider" />

            <div className="order-summary-items">
              {items.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
                  Your cart is empty.{" "}
                  <Link href="/" style={{ color: "var(--gold-mid)" }}>Shop Now</Link>
                </p>
              ) : (
                items.map(item => (
                  <div key={`${item.id}-${item.size}`} className="order-item">
                    <div className="order-item-img">
                      <img src={getImageUrl(item.image)} alt={item.name} />
                      <span className="order-item-qty">{item.quantity}</span>
                    </div>
                    <div className="order-item-info">
                      <p className="order-item-name">{item.name}</p>
                      <p className="order-item-size">Size: {item.size}</p>
                    </div>
                    <span className="order-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>

            <div className="order-summary-divider" />

            <div className="order-totals">
              <div className="order-total-row">
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="order-total-row">
                <span>Shipping</span>
                <span style={{ color: shippingFee === 0 ? "var(--sale-badge)" : "inherit" }}>
                  {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                </span>
              </div>
              {shippingFee > 0 && (
                <p className="free-shipping-note">
                  Add ₹{(1000 - cartTotal).toLocaleString()} more for FREE shipping
                </p>
              )}
              <div className="order-summary-divider" style={{ margin: "10px 0" }} />
              <div className="order-total-row order-grand-total">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button className="place-order-btn" onClick={() => setPlaced(true)} disabled={items.length === 0}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Pay ₹{grandTotal.toLocaleString()} Securely
            </button>

            <p className="checkout-trust-note">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              100% Secure · 15-day Easy Exchange
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
