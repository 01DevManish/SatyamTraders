'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import styles from './Header.module.css';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { cartCount } = useCart();
    const { user, logout, isLoggedIn } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <header className={styles.header}>
            <div className={`container ${styles.headerInner}`}>
                <Link href="/" className={styles.logo}>Satyam<span>Traders</span></Link>

                <nav className={`${styles.navMenu} ${menuOpen ? styles.active : ''}`}>
                    <Link href="/" className={styles.navLink}>Home</Link>
                    <Link href="/shop" className={styles.navLink}>Shop</Link>
                    <Link href="/about" className={styles.navLink}>About</Link>
                    <Link href="/contact" className={styles.navLink}>Contact</Link>
                </nav>

                <div className={styles.headerActions}>
                    {isLoggedIn ? (
                        <div className={styles.userMenu}>
                            <span className={styles.userEmail}>{user?.email?.split('@')[0]}</span>
                            <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
                        </div>
                    ) : (
                        <Link href="/login" className={styles.loginBtn}>Login</Link>
                    )}

                    <Link href="/cart" className={styles.headerIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
                    </Link>

                    <button className={styles.mobileMenuBtn} onClick={() => setMenuOpen(!menuOpen)}>
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </div>
        </header>
    );
}
