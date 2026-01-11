'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const { user, isLoggedIn } = useAuth();

    // Load cart from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('satyam-cart');
        if (saved) setCartItems(JSON.parse(saved));
        setIsLoaded(true);
    }, []);

    // Sync with Firebase when user logs in
    useEffect(() => {
        if (isLoggedIn && user && isLoaded) {
            syncCartWithFirebase();
        }
    }, [isLoggedIn, user, isLoaded]);

    // Save to localStorage whenever cart changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('satyam-cart', JSON.stringify(cartItems));
            // Also sync to Firebase if logged in
            if (isLoggedIn && user) {
                saveCartToFirebase(cartItems);
            }
        }
    }, [cartItems, isLoaded, isLoggedIn, user]);

    const syncCartWithFirebase = async () => {
        try {
            const cartRef = doc(db, 'carts', user.uid);
            const cartSnap = await getDoc(cartRef);

            if (cartSnap.exists()) {
                const firebaseCart = cartSnap.data().items || [];
                // Merge local cart with Firebase cart
                const localCart = [...cartItems];
                const mergedCart = [...firebaseCart];

                localCart.forEach(localItem => {
                    const existingIndex = mergedCart.findIndex(item => item.id === localItem.id);
                    if (existingIndex >= 0) {
                        // Update quantity to max of both
                        mergedCart[existingIndex].quantity = Math.max(
                            mergedCart[existingIndex].quantity,
                            localItem.quantity
                        );
                    } else {
                        mergedCart.push(localItem);
                    }
                });

                setCartItems(mergedCart);
            } else {
                // No Firebase cart, save local cart to Firebase
                await saveCartToFirebase(cartItems);
            }
        } catch (error) {
            console.error('Error syncing cart:', error);
        }
    };

    const saveCartToFirebase = async (items) => {
        if (!user) return;
        try {
            const cartRef = doc(db, 'carts', user.uid);
            await setDoc(cartRef, { items, updatedAt: new Date().toISOString() });
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    };

    const addToCart = (product, quantity = 1) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return removeFromCart(productId);
        setCartItems(prev => prev.map(item =>
            item.id === productId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => {
        setCartItems([]);
        if (isLoggedIn && user) {
            saveCartToFirebase([]);
        }
    };

    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, isLoaded }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
