'use client';
import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/context/ProductContext';
import styles from './page.module.css';

function ShopContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category') || '';
    const { products, categories, isLoaded } = useProducts();

    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [sortBy, setSortBy] = useState('default');
    const [priceRange, setPriceRange] = useState('all');

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (selectedCategory) {
            result = result.filter(p => p.category === selectedCategory);
        }

        if (priceRange !== 'all') {
            const [min, max] = priceRange.split('-').map(Number);
            result = result.filter(p => p.price >= min && (!max || p.price <= max));
        }

        if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
        else if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));

        return result;
    }, [products, selectedCategory, sortBy, priceRange]);

    if (!isLoaded) {
        return <div className="page-header"><div className="container"><h1>Loading...</h1></div></div>;
    }

    return (
        <>
            <div className="page-header">
                <div className="container">
                    <div className="breadcrumb">
                        <a href="/">Home</a> <span>/</span> <span>Shop</span>
                    </div>
                    <h1>Shop Our Collection</h1>
                    <p>Discover premium home decor pieces for every room</p>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <div className={styles.shopLayout}>
                        {/* Sidebar Filters */}
                        <aside className={styles.sidebar}>
                            <div className={styles.filterGroup}>
                                <h4>Categories</h4>
                                <label className={styles.filterOption}>
                                    <input type="radio" name="category" checked={selectedCategory === ''} onChange={() => setSelectedCategory('')} />
                                    <span>All Categories</span>
                                </label>
                                {categories.map(cat => (
                                    <label key={cat} className={styles.filterOption}>
                                        <input type="radio" name="category" checked={selectedCategory === cat} onChange={() => setSelectedCategory(cat)} />
                                        <span>{cat}</span>
                                    </label>
                                ))}
                            </div>

                            <div className={styles.filterGroup}>
                                <h4>Price Range</h4>
                                <label className={styles.filterOption}>
                                    <input type="radio" name="price" checked={priceRange === 'all'} onChange={() => setPriceRange('all')} />
                                    <span>All Prices</span>
                                </label>
                                <label className={styles.filterOption}>
                                    <input type="radio" name="price" checked={priceRange === '0-1500'} onChange={() => setPriceRange('0-1500')} />
                                    <span>Under ₹1,500</span>
                                </label>
                                <label className={styles.filterOption}>
                                    <input type="radio" name="price" checked={priceRange === '1500-3000'} onChange={() => setPriceRange('1500-3000')} />
                                    <span>₹1,500 - ₹3,000</span>
                                </label>
                                <label className={styles.filterOption}>
                                    <input type="radio" name="price" checked={priceRange === '3000-99999'} onChange={() => setPriceRange('3000-99999')} />
                                    <span>Above ₹3,000</span>
                                </label>
                            </div>
                        </aside>

                        {/* Product Grid */}
                        <div className={styles.shopMain}>
                            <div className={styles.toolbar}>
                                <span>Showing {filteredProducts.length} products</span>
                                <select className={styles.sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="default">Default Sorting</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name">Name: A to Z</option>
                                </select>
                            </div>

                            <div className={styles.productsGrid}>
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {filteredProducts.length === 0 && (
                                <div className={styles.noProducts}>
                                    <h3>No products found</h3>
                                    <p>Try adjusting your filters</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="page-header"><div className="container"><h1>Loading...</h1></div></div>}>
            <ShopContent />
        </Suspense>
    );
}
