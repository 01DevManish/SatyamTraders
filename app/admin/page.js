'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

// Helper: Compress and convert to Base64
const processImageForDatabase = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new window.Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Resize to something safe for Database (Max 600px)
                const MAX_WIDTH = 600;
                if (width > MAX_WIDTH) {
                    height = Math.round((height * MAX_WIDTH) / width);
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Compress to JPEG with 0.6 quality
                // This usually results in a string size ~50-100KB, well under 1MB limit
                const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

export default function AdminPage() {
    const { products, customProducts, categories, addProduct, deleteProduct, isLoaded } = useProducts();
    const { isAdmin, loading, isLoggedIn } = useAuth();
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

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
            // Show preview immediately
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            alert('Please upload a product image');
            return;
        }

        try {
            setUploadStatus('compressing');

            // 1. Process Image (Resize & Compress)
            const compressedBase64 = await processImageForDatabase(imageFile);

            // Check size (Firestore limit is ~1MB = 1,048,576 bytes)
            // Base64 string length * 0.75 is approx file size in bytes
            const approxSize = compressedBase64.length * 0.75;
            if (approxSize > 900000) { // Safety margin 900KB
                throw new Error("Image is still too large after compression. Please try a simpler image.");
            }

            setUploadStatus('saving');

            // 2. Save directly to Database
            await addProduct({
                ...formData,
                price: parseInt(formData.price),
                originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : null,
                image: compressedBase64 // Saving the image string directly
            });

            // Reset
            setFormData({ name: '', category: categories[0], price: '', originalPrice: '', description: '', badge: '', image: '' });
            setImagePreview('');
            setImageFile(null);
            setShowForm(false);
            alert('Product saved to database successfully!');
        } catch (error) {
            console.error("Error adding product:", error);
            alert(`Failed: ${error.message}`);
        } finally {
            setUploadStatus('');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id);
        }
    };

    if (loading || !isLoaded) {
        return (
            <div className="page-header">
                <div className="container">
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <h2>Loading...</h2>
                    </div>
                </div>
            </div>
        );
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
                                        <p style={{ marginTop: '10px', fontSize: '0.8rem', color: '#666' }}>
                                            Image will be compressed to fit in database.
                                        </p>
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
                                        <button type="submit" className="btn btn-gold btn-lg" disabled={!!uploadStatus}>
                                            {uploadStatus === 'compressing' ? 'Compressing Image...' :
                                                uploadStatus === 'saving' ? 'Saving to DB...' :
                                                    'Add Product'}
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
