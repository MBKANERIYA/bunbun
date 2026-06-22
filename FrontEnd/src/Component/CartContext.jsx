/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import { getAuthUserId } from "../utils/auth";
import { apiUrl } from "../utils/apiConfig";

const CartContext = createContext();
const API_BASE = apiUrl("/v1/cart");

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(getAuthUserId());

    const getGuestCart = () => JSON.parse(localStorage.getItem('guestCart')) || { product: [], cartTotal: 0 };
    const saveGuestCart = (c) => localStorage.setItem('guestCart', JSON.stringify(c));

    const fetchCart = useCallback(async () => {
        setLoading(true);
        if (!userId) {
            setCart(getGuestCart());
            setError(null);
            setLoading(false);
            return;
        }

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

    // Sync guest cart to backend when user logs in
    useEffect(() => {
        const syncGuestCart = async () => {
            if (userId) {
                const guestCart = getGuestCart();
                if (guestCart && guestCart.product && guestCart.product.length > 0) {
                    try {
                        for (const item of guestCart.product) {
                            await axios.post(`${API_BASE}/createCart`, { 
                                userId, 
                                productId: item.productId._id, 
                                size: item.size,
                                quantity: item.quantity 
                            });
                        }
                        localStorage.removeItem('guestCart');
                        fetchCart(); // refresh with backend data
                    } catch (err) {
                        console.error("Error syncing guest cart", err);
                    }
                }
            }
        };
        syncGuestCart();
    }, [fetchCart, userId]);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const addToCart = async (productId, size = null) => {
        if (!userId) {
            try {
                // fetch product details for guest cart
                const { data } = await axios.get(apiUrl(`/v1/product/singleProduct/${productId}`));
                const productDetail = data.singleProduct;
                if (!productDetail) return false;

                const gCart = getGuestCart();
                const existingIndex = gCart.product.findIndex(p => p.productId._id === productId && p.size === size);
                
                const sellingPrice = Number(productDetail.selling_price) || 0;
                
                if (existingIndex >= 0) {
                    gCart.product[existingIndex].quantity += 1;
                    gCart.product[existingIndex].totalPrice = gCart.product[existingIndex].quantity * sellingPrice;
                } else {
                    gCart.product.push({
                        productId: {
                            _id: productDetail._id,
                            name: productDetail.name,
                            image: productDetail.image,
                            selling_price: productDetail.selling_price,
                            mrp: productDetail.mrp,
                            category: productDetail.category,
                            subcategory: productDetail.subcategory
                        },
                        quantity: 1,
                        size: size,
                        totalPrice: sellingPrice
                    });
                }
                gCart.cartTotal = gCart.product.reduce((sum, item) => sum + item.totalPrice, 0);
                saveGuestCart(gCart);
                setCart(gCart);
                openCart();
                return true;
            } catch (err) {
                console.error("Error adding to guest cart:", err);
                return false;
            }
        }

        try {
            await axios.post(`${API_BASE}/createCart`, { userId, productId, size });
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
        if (!userId) {
            const gCart = getGuestCart();
            const item = gCart.product.find(p => p.productId._id === productId);
            if (item) {
                const sellingPrice = Number(item.productId.selling_price) || 0;
                if (action === 'increment') {
                    item.quantity += 1;
                } else if (action === 'decrement') {
                    item.quantity -= 1;
                    if (item.quantity <= 0) {
                        gCart.product = gCart.product.filter(p => p.productId._id !== productId);
                    }
                }
                if (item.quantity > 0) {
                    item.totalPrice = item.quantity * sellingPrice;
                }
                gCart.cartTotal = gCart.product.reduce((sum, i) => sum + i.totalPrice, 0);
                saveGuestCart(gCart);
                setCart(gCart);
            }
            return;
        }

        try {
            const { data } = await axios.put(`${API_BASE}/update-quantity`, { userId, productId, action });
            setCart(data.cart || { product: [], cartTotal: 0 });
        } catch (err) {
            console.error("Error updating quantity:", err);
        }
    };

    const removeFromCart = async (productId) => {
        if (!userId) {
            const gCart = getGuestCart();
            gCart.product = gCart.product.filter(p => p.productId._id !== productId);
            gCart.cartTotal = gCart.product.reduce((sum, i) => sum + i.totalPrice, 0);
            saveGuestCart(gCart);
            setCart(gCart);
            return true;
        }

        try {
            const { data } = await axios.delete(`${API_BASE}/remove/${userId}/${productId}`);
            setCart(data.cart || { product: [], cartTotal: 0 });
            return true;
        } catch (err) {
            console.error("Error removing from cart:", err);
            return false;
        }
    };

    const clearCart = async () => {
        if (!userId) {
            localStorage.removeItem('guestCart');
            setCart({ product: [], cartTotal: 0 });
            return;
        }

        try {
            const { data } = await axios.delete(`${API_BASE}/clear/${userId}`);
            setCart(data.cart || { product: [], cartTotal: 0 });
        } catch (err) {
            console.error("Error clearing cart:", err);
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
        clearCart,
        itemCount: cart?.product?.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) || 0
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
