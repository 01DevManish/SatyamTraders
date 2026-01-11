'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart, isLoaded } = useCart();
    const { isLoggedIn, user, loading } = useAuth();
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState('razorpay');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId] = useState(() => `ST${Date.now().toString().slice(-8)}`);

    const deliveryFee = cartTotal >= 999 ? 0 : 99;
    const total = cartTotal + deliveryFee;

    // Redirect to login if not logged in
    useEffect(() => {
        if (!loading && !isLoggedIn) {
            router.push('/login');
        }
    }, [loading, isLoggedIn, router]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        setOrderPlaced(true);
        clearCart();
    };

    if (loading || !isLoaded) {
        return <div className="page-header"><div className="container"><h1>Loading...</h1></div></div>;
    }

    if (!isLoggedIn) {
        return <div className="page-header"><div className="container"><h1>Redirecting to login...</h1></div></div>;
    }

    if (orderPlaced) {
        return (
            <div className={styles.successPage}>
                <div className={styles.successContent}>
                    <div className={styles.successIcon}>✓</div>
                    <h1>Order Placed Successfully!</h1>
                    <p>Thank you for shopping with Satyam Traders, {user?.email?.split('@')[0]}! Your order has been confirmed.</p>
                    <div className={styles.orderNumber}>Order ID: <strong>{orderId}</strong></div>
                    <Link href="/shop" className="btn btn-primary">Continue Shopping</Link>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="page-header">
                <div className="container">
                    <h1>Your cart is empty</h1>
                    <Link href="/shop" className="btn btn-primary">Shop Now</Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="page-header">
                <div className="container">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link> <span>/</span>
                        <Link href="/cart">Cart</Link> <span>/</span>
                        <span>Checkout</span>
                    </div>
                    <h1>Checkout</h1>
                    <p>Logged in as: {user?.email}</p>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <form onSubmit={handleSubmit} className={styles.checkoutLayout}>
                        <div className={styles.checkoutForm}>
                            <div className={styles.checkoutSection}>
                                <h3>📍 Shipping Address</h3>
                                <div className="form-row">
                                    <div className="form-group"><label>First Name *</label><input type="text" required /></div>
                                    <div className="form-group"><label>Last Name *</label><input type="text" required /></div>
                                </div>
                                <div className="form-group"><label>Email *</label><input type="email" defaultValue={user?.email} required /></div>
                                <div className="form-group"><label>Phone *</label><input type="tel" required /></div>
                                <div className="form-group"><label>Address *</label><input type="text" placeholder="House no, Street, Landmark" required /></div>
                                <div className="form-row">
                                    <div className="form-group"><label>City *</label><input type="text" required /></div>
                                    <div className="form-group"><label>PIN Code *</label><input type="text" required /></div>
                                </div>
                                <div className="form-group"><label>State *</label><select required><option value="">Select State</option><option>Maharashtra</option><option>Delhi</option><option>Karnataka</option><option>Tamil Nadu</option><option>Gujarat</option><option>Other</option></select></div>
                            </div>

                            <div className={styles.checkoutSection}>
                                <h3>💳 Payment Method</h3>
                                <div className={styles.paymentOptions}>
                                    <label className={`${styles.paymentOption} ${paymentMethod === 'razorpay' ? styles.selected : ''}`}>
                                        <input type="radio" name="payment" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                        <div><strong>Razorpay</strong><span>UPI, Cards, Netbanking, Wallets</span></div>
                                    </label>
                                    <label className={`${styles.paymentOption} ${paymentMethod === 'stripe' ? styles.selected : ''}`}>
                                        <input type="radio" name="payment" value="stripe" checked={paymentMethod === 'stripe'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                        <div><strong>Stripe</strong><span>Credit/Debit Cards</span></div>
                                    </label>
                                    <label className={`${styles.paymentOption} ${paymentMethod === 'cod' ? styles.selected : ''}`}>
                                        <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                        <div><strong>Cash on Delivery</strong><span>Pay when you receive</span></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className={styles.orderSummary}>
                            <h3>Order Summary</h3>
                            <div className={styles.orderItems}>
                                {cartItems.map((item) => (
                                    <div key={item.id} className={styles.orderItem}>
                                        <div className={styles.orderItemImage}>
                                            <Image src={item.image} alt={item.name} fill sizes="60px" style={{ objectFit: 'cover' }} />
                                        </div>
                                        <div className={styles.orderItemInfo}>
                                            <h5>{item.name}</h5>
                                            <span>Qty: {item.quantity}</span>
                                        </div>
                                        <div className={styles.orderItemPrice}>₹{(item.price * item.quantity).toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.summaryRow}><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
                            <div className={styles.summaryRow}><span>Delivery</span><span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
                            <div className={`${styles.summaryRow} ${styles.total}`}><span>Total</span><span>₹{total.toLocaleString()}</span></div>
                            <button type="submit" className="btn btn-primary btn-lg">Place Order</button>
                            <p className={styles.secure}>🔒 Secure checkout powered by SSL encryption</p>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
}
