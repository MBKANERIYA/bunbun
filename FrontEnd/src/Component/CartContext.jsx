import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import { getAuthUserId } from "../utils/auth";

const CartContext = createContext();

export let useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(getAuthUserId());

    const API_BASE = "http://localhost:4000/v1/cart";

    const fetchCart = useCallback(async () => {
        if (!userId) {
            setCart(null);
            setError(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.get(`${API_BASE}/getCart/${userId}`);
            setCart(data.cart || { product: [], cartTotal: 0 });
            setError(null);
        } catch (err) {
            console.error("Error fetching cart:", err);
            setError("Could not load cart.");
            setCart({ product: [], cartTotal: 0 });
        } finally {
            setLoading(false);
        }
    }, [userId]);
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    useEffect(() => {
        const syncAuthUser = () => setUserId(getAuthUserId());

        window.addEventListener("authChanged", syncAuthUser);
        window.addEventListener("storage", syncAuthUser);

        return () => {
            window.removeEventListener("authChanged", syncAuthUser);
            window.removeEventListener("storage", syncAuthUser);
        };
    }, []);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const addToCart = async (productId) => {
        if (!userId) {
            alert("Please login to add products to cart.");
            return false;
        }

        try {
            await axios.post(`${API_BASE}/createCart`, { userId, productId });
            await fetchCart();
            openCart();
            return true;
        } catch (err) {
            console.error("Error adding to cart:", err);
            alert("Failed to add product to cart");
            return false;
        }
    };

    const updateQuantity = async (productId, action) => {
        if (!userId) return;

        try {
            const { data } = await axios.put(`${API_BASE}/update-quantity`, { userId, productId, action });
            setCart(data.cart || { product: [], cartTotal: 0 });
        } catch (err) {
            console.error("Error updating quantity:", err);
        }
    };

    const removeFromCart = async (productId) => {
        if (!userId) return false;

        try {
            const { data } = await axios.delete(`${API_BASE}/remove/${userId}/${productId}`);
            setCart(data.cart || { product: [], cartTotal: 0 });
            return true;
        } catch (err) {
            console.error("Error removing from cart:", err);
            return false;
        }
    };

    const value = {
        cart,
        isCartOpen,
        loading,
        error,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        itemCount: cart?.product?.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) || 0
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
