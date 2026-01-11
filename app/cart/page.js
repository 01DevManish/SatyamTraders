'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, cartTotal, isLoaded } = useCart();
    const deliveryFee = cartTotal >= 999 ? 0 : 99;
    const total = cartTotal + deliveryFee;

    if (!isLoaded) {
        return <div className="page-header"><div className="container"><h1>Loading...</h1></div></div>;
    }

    return (
        <>
            <div className="page-header">
                <div className="container">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link> <span>/</span> <span>Cart</span>
                    </div>
                    <h1>Shopping Cart</h1>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    {cartItems.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <div className={styles.emptyIcon}>🛒</div>
                            <h3>Your cart is empty</h3>
                            <p>Looks like you haven't added anything to your cart yet.</p>
                            <Link href="/shop" className="btn btn-primary">Continue Shopping</Link>
                        </div>
                    ) : (
                        <div className={styles.cartLayout}>
                            <div className={styles.cartItems}>
                                <div className={styles.cartHeader}>
                                    <span>Product</span>
                                    <span>Price</span>
                                    <span>Quantity</span>
                                    <span>Total</span>
                                    <span></span>
                                </div>

                                {cartItems.map((item) => (
                                    <div key={item.id} className={styles.cartItem}>
                                        <div className={styles.cartItemInfo}>
                                            <div className={styles.cartItemImage}>
                                                <Image src={item.image} alt={item.name} fill sizes="100px" style={{ objectFit: 'cover' }} />
                                            </div>
                                            <div>
                                                <h4>{item.name}</h4>
                                                <span>{item.category}</span>
                                            </div>
                                        </div>
                                        <div className={styles.cartItemPrice}>₹{item.price.toLocaleString()}</div>
                                        <div className={styles.quantityInput}>
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                        <div className={styles.cartItemTotal}>₹{(item.price * item.quantity).toLocaleString()}</div>
                                        <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>×</button>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.cartSummary}>
                                <h3>Order Summary</h3>
                                <div className={styles.summaryRow}>
                                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                    <span>₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Delivery</span>
                                    <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                                </div>
                                {deliveryFee > 0 && (
                                    <p className={styles.freeDelivery}>Add ₹{999 - cartTotal} more for free delivery!</p>
                                )}
                                <div className={`${styles.summaryRow} ${styles.total}`}>
                                    <span>Total</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </div>
                                <div className={styles.couponInput}>
                                    <input type="text" placeholder="Coupon code" />
                                    <button className="btn btn-secondary btn-sm">Apply</button>
                                </div>
                                <Link href="/checkout" className="btn btn-primary btn-lg">Proceed to Checkout</Link>
                                <Link href="/shop" className={styles.continueShopping}>← Continue Shopping</Link>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
