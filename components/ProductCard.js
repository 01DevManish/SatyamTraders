'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <div className={styles.productCard}>
            <div className={styles.productImage}>
                <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 25vw" style={{ objectFit: 'cover' }} />
                {product.badge && <span className={styles.productBadge}>{product.badge}</span>}
                <div className={styles.productActions}>
                    <Link href={`/product/${product.id}`} className={styles.productActionBtn} title="View Details">👁️</Link>
                    <button className={styles.productActionBtn} onClick={() => addToCart(product)} title="Add to Cart">🛒</button>
                </div>
            </div>
            <div className={styles.productInfo}>
                <span className={styles.productCategory}>{product.category}</span>
                <h3 className={styles.productTitle}><Link href={`/product/${product.id}`}>{product.name}</Link></h3>
                <div className={styles.productPrice}>
                    ₹{product.price.toLocaleString()}
                    {product.originalPrice && <span className={styles.originalPrice}>₹{product.originalPrice.toLocaleString()}</span>}
                </div>
            </div>
        </div>
    );
}
