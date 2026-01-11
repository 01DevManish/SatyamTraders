import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerGrid}>
                    <div className={styles.footerBrand}>
                        <Link href="/" className={styles.logo}>Satyam<span>Traders</span></Link>
                        <p>Transforming homes with premium, elegantly crafted decor pieces that bring warmth and style to every space.</p>
                        <div className={styles.footerSocial}>
                            <a href="#" aria-label="Facebook">📘</a>
                            <a href="#" aria-label="Instagram">📸</a>
                            <a href="#" aria-label="Pinterest">📌</a>
                        </div>
                    </div>

                    <div>
                        <h4>Quick Links</h4>
                        <ul className={styles.footerLinks}>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/shop">Shop All</Link></li>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Categories</h4>
                        <ul className={styles.footerLinks}>
                            <li><Link href="/shop?category=Wall Decor">Wall Decor</Link></li>
                            <li><Link href="/shop?category=Lighting">Lighting</Link></li>
                            <li><Link href="/shop?category=Table & Shelf Decor">Table Decor</Link></li>
                            <li><Link href="/shop?category=Planters & Vases">Planters</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Contact Info</h4>
                        <ul className={styles.footerLinks}>
                            <li>📍 Chandni Chowk, Delhi</li>
                            <li>📞 +91 85959 99696</li>
                            <li>✉️ hello@satyamtraders.com</li>
                            <li>🕐 Mon-Sat: 10AM - 7PM</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p>© 2024 Satyam Traders. All rights reserved. | Made with ❤️ in India</p>
                </div>
            </div>
        </footer>
    );
}
