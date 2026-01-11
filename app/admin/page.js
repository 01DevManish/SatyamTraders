'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from './page.module.css';

export default function AdminPage() {
    const { products, customProducts, categories, addProduct, deleteProduct, isLoaded } = useProducts();
    const { isAdmin, loading, isLoggedIn } = useAuth();
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: '', category: categories[0], price: '', originalPrice: '', description: '', badge: '', image: ''
    });

    // Redirect non-admin users
    useEffect(() => {
        if (!loading && (!isLoggedIn || !isAdmin)) {
            router.push('/');
        }
    }, [loading, isLoggedIn, isAdmin, router]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            alert('Please upload a product image');
            return;
        }

        setUploading(true);
        try {
            // 1. Upload image to Firebase Storage
            const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // 2. Add product to Firestore with image URL
            await addProduct({
                ...formData,
                price: parseInt(formData.price),
                originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : null,
                image: downloadURL // Use the Storage URL instead of base64
            });

            // Reset form
            setFormData({ name: '', category: categories[0], price: '', originalPrice: '', description: '', badge: '', image: '' });
            setImagePreview('');
            setImageFile(null);
            setShowForm(false);
            alert('Product added successfully!');
        } catch (error) {
            console.error("Error adding product:", error);
            alert('Failed to add product. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    if (loading || !isLoaded) {
        return <div className="page-header"><div className="container"><h1>Loading...</h1></div></div>;
    }

    if (!isAdmin) {
        return <div className="page-header"><div className="container"><h1>Access Denied</h1><p>Only admin can access this page.</p></div></div>;
    }

    return (
        <>
            <div className="page-header">
                <div className="container">
                    <div className="breadcrumb"><Link href="/">Home</Link> <span>/</span> <span>Admin</span></div>
                    <h1>Product Management</h1>
                    <p>Add, edit, and manage your product catalog</p>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <div className={styles.adminHeader}>
                        <div>
                            <h2>All Products ({products.length})</h2>
                            <span className={styles.subtext}>Custom products: {customProducts.length}</span>
                        </div>
                        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                            {showForm ? '✕ Cancel' : '+ Add New Product'}
                        </button>
                    </div>

                    {showForm && (
                        <div className={styles.formCard}>
                            <h3>Add New Product</h3>
                            <form onSubmit={handleSubmit} className={styles.productForm}>
                                <div className={styles.formGrid}>
                                    <div className={styles.imageUpload}>
                                        <label>Product Image *</label>
                                        <div className={styles.uploadArea} onClick={() => document.getElementById('imageInput').click()}>
                                            {imagePreview ? (
                                                <Image src={imagePreview} alt="Preview" fill style={{ objectFit: 'cover' }} />
                                            ) : (
                                                <div className={styles.uploadPlaceholder}>
                                                    <span>📷</span>
                                                    <p>Click to upload image</p>
                                                </div>
                                            )}
                                        </div>
                                        <input type="file" id="imageInput" accept="image/*" onChange={handleImageUpload} hidden />
                                    </div>

                                    <div className={styles.formFields}>
                                        <div className="form-group">
                                            <label>Product Name *</label>
                                            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="e.g. Ceramic Table Lamp" />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Category *</label>
                                                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Badge (optional)</label>
                                                <select value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })}>
                                                    <option value="">None</option>
                                                    <option value="New">New</option>
                                                    <option value="Bestseller">Bestseller</option>
                                                    <option value="Sale">Sale</option>
                                                    <option value="Premium">Premium</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Price (₹) *</label>
                                                <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required placeholder="1999" min="1" />
                                            </div>
                                            <div className="form-group">
                                                <label>Original Price (₹)</label>
                                                <input type="number" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} placeholder="2499" min="1" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Description *</label>
                                            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required placeholder="Describe your product..." rows="3"></textarea>
                                        </div>
                                        <button type="submit" className="btn btn-gold btn-lg" disabled={uploading}>
                                            {uploading ? 'Uploading...' : 'Add Product'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className={styles.productTable}>
                        <div className={styles.tableHeader}>
                            <span>Image</span><span>Product</span><span>Category</span><span>Price</span><span>Actions</span>
                        </div>
                        {products.map((product) => (
                            <div key={product.id} className={styles.tableRow}>
                                <div className={styles.productThumb}>
                                    <Image src={product.image} alt={product.name} fill sizes="60px" style={{ objectFit: 'cover' }} />
                                </div>
                                <div className={styles.productName}>
                                    <h4>{product.name}</h4>
                                    {product.badge && <span className={styles.badge}>{product.badge}</span>}
                                    {product.isCustom && <span className={styles.customBadge}>Custom</span>}
                                </div>
                                <span>{product.category}</span>
                                <span className={styles.price}>₹{product.price.toLocaleString()}</span>
                                <div className={styles.actions}>
                                    <Link href={`/product/${product.id}`} className={styles.actionBtn} title="View">👁️</Link>
                                    {product.isCustom && (
                                        <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(product.id)} title="Delete">🗑️</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
