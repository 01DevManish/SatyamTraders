'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { products as staticProducts, categories } from '@/data/products';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [customProducts, setCustomProducts] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Fetch products from Firestore on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const fetchedProducts = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    isCustom: true
                }));
                setCustomProducts(fetchedProducts);
            } catch (error) {
                console.error("Error fetching products: ", error);
            } finally {
                setIsLoaded(true);
            }
        };

        fetchProducts();
    }, []);

    // Combine static and custom products
    const allProducts = [...customProducts, ...staticProducts];

    const addProduct = async (product) => {
        try {
            const newProductData = {
                ...product,
                createdAt: new Date().toISOString(),
            };

            const docRef = await addDoc(collection(db, 'products'), newProductData);

            const newProduct = {
                id: docRef.id,
                ...newProductData,
                isCustom: true
            };

            setCustomProducts(prev => [newProduct, ...prev]);
            return newProduct;
        } catch (error) {
            console.error("Error adding product: ", error);
            throw error;
        }
    };

    const updateProduct = (productId, updates) => {
        // Implement if needed for Firestore
        setCustomProducts(prev => prev.map(p =>
            p.id === productId ? { ...p, ...updates } : p
        ));
    };

    const deleteProduct = async (productId) => {
        try {
            await deleteDoc(doc(db, 'products', productId));
            setCustomProducts(prev => prev.filter(p => p.id !== productId));
        } catch (error) {
            console.error("Error deleting product: ", error);
            alert("Failed to delete product");
        }
    };

    return (
        <ProductContext.Provider value={{
            products: allProducts,
            customProducts,
            categories,
            addProduct,
            updateProduct,
            deleteProduct,
            isLoaded
        }}>
            {children}
        </ProductContext.Provider>
    );
}

export const useProducts = () => useContext(ProductContext);
