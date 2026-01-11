'use client';
import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductContext';
import styles from './page.module.css';

export default function ProductPage({ params }) {
    const { id } = use(params);
    const { products } = useProducts();
    const product = products.find(p => p.id === parseInt(id));
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showZoom, setShowZoom] = useState(false);

    if (!product) {
        return (
            <div className="page-header">
                <div className="container">
                    <h1>Product Not Found</h1>
                    <Link href="/shop" className="btn btn-primary">Back to Shop</Link>
                </div>
            </div>
        );
    }

    const images = [product.image, product.image, product.image];
    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        alert(`${product.name} added to cart!`);
    };

    return (
        <>
            <div className="page-header">
                <div className="container">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link> <span>/</span>
                        <Link href="/shop">Shop</Link> <span>/</span>
                        <span>{product.name}</span>
                    </div>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <div className={styles.productDetail}>
                        {/* Gallery */}
                        <div className={styles.gallery}>
                            <div className={styles.galleryMain} onClick={() => setShowZoom(true)}>
                                <Image src={images[selectedImage]} alt={product.name} fill sizes="50vw" style={{ objectFit: 'cover' }} />
                            </div>
                            <div className={styles.galleryThumbs}>
                                {images.map((img, i) => (
                                    <button key={i} className={`${styles.galleryThumb} ${selectedImage === i ? styles.active : ''}`} onClick={() => setSelectedImage(i)}>
                                        <Image src={img} alt={`${product.name} ${i + 1}`} fill sizes="80px" style={{ objectFit: 'cover' }} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className={styles.productInfo}>
                            <span className={styles.category}>{product.category}</span>
                            <h1>{product.name}</h1>
                            <div className={styles.price}>
                                ₹{product.price.toLocaleString()}
                                {product.originalPrice && <span className={styles.originalPrice}>₹{product.originalPrice.toLocaleString()}</span>}
                            </div>

                            <p className={styles.description}>{product.description}</p>

                            <div className={styles.variants}>
                                <span className={styles.variantLabel}>Size:</span>
                                <div className={styles.variantOptions}>
                                    <button className={`${styles.variantBtn} ${styles.active}`}>Small</button>
                                    <button className={styles.variantBtn}>Medium</button>
                                    <button className={styles.variantBtn}>Large</button>
                                </div>
                            </div>

                            <div className={styles.quantityRow}>
                                <span>Quantity:</span>
                                <div className={styles.quantityInput}>
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                                    <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} min="1" />
                                    <button onClick={() => setQuantity(q => q + 1)}>+</button>
                                </div>
                            </div>

                            <div className={styles.buttons}>
                                <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>Add to Cart</button>
                                <Link href="/checkout" className="btn btn-gold btn-lg" onClick={() => addToCart(product, quantity)}>Buy Now</Link>
                            </div>

                            <div className={styles.meta}>
                                <div className={styles.metaItem}><strong>📦 Delivery:</strong> <span>Free delivery on orders above ₹999</span></div>
                                <div className={styles.metaItem}><strong>🔄 Returns:</strong> <span>Easy 7-day returns</span></div>
                                <div className={styles.metaItem}><strong>✨ Care:</strong> <span>Clean with soft, dry cloth</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className={styles.related}>
                            <h2>You May Also Like</h2>
                            <div className={styles.relatedGrid}>
                                {relatedProducts.map(p => (
                                    <Link key={p.id} href={`/product/${p.id}`} className={styles.relatedCard}>
                                        <div className={styles.relatedImage}>
                                            <Image src={p.image} alt={p.name} fill sizes="200px" style={{ objectFit: 'cover' }} />
                                        </div>
                                        <h4>{p.name}</h4>
                                        <span>₹{p.price.toLocaleString()}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Zoom Modal */}
            {showZoom && (
                <div className={styles.zoomModal} onClick={() => setShowZoom(false)}>
                    <button className={styles.zoomClose}>×</button>
                    <Image src={images[selectedImage]} alt={product.name} width={800} height={800} style={{ objectFit: 'contain' }} />
                </div>
            )}
        </>
    );
}
