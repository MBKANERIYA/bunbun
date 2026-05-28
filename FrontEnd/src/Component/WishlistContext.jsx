import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import axios from 'axios';
import { getAuthUserId } from '../utils/auth';
import { apiUrl } from '../utils/apiConfig';

// Create the context
const WishlistContext = createContext();

// Custom hook for easy consumption
export const useWishlist = () => useContext(WishlistContext);

// The Provider component
export const WishlistProvider = ({ children }) => {
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(getAuthUserId());

    const fetchWishlistIds = useCallback(async () => {
        if (!userId) {
            setWishlistIds(new Set());
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(apiUrl(`/v1/wishlist/getWishlist/${userId}`));
            const ids = response.data?.wishlist?.product
                ?.map(item => item.productId?._id)
                .filter(Boolean) || [];
            setWishlistIds(new Set(ids));
        } catch (error) {
            console.error("Failed to fetch wishlist IDs:", error);
            setWishlistIds(new Set());
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchWishlistIds();
    }, [fetchWishlistIds]);

    useEffect(() => {
        const syncAuthUser = () => setUserId(getAuthUserId());

        window.addEventListener("authChanged", syncAuthUser);
        window.addEventListener("storage", syncAuthUser);

        return () => {
            window.removeEventListener("authChanged", syncAuthUser);
            window.removeEventListener("storage", syncAuthUser);
        };
    }, []);

    const addToWishlistAPI = async (productId) => {
        if (!userId) {
            alert("Please login to add products to wishlist.");
            return false;
        }

        try {
            await axios.post(apiUrl("/v1/wishlist/createWishlist"), { userId, productId });
            return true;
        } catch (err) {
            console.error("Error adding to wishlist:", err);
            alert(err.response?.data?.message || "Failed to add product to wishlist");
            return false;
        }
    };

    const removeFromWishlistAPI = async (productId) => {
        if (!userId) return false;

        try {
            await axios.delete(apiUrl(`/v1/wishlist/removeWishlist/${userId}/${productId}`));
            return true;
        } catch (err) {
            console.error("Error removing from wishlist:", err);
            alert("Failed to remove product from wishlist.");
            return false;
        }
    };

    const addToWishlist = async (productId) => {
        const success = await addToWishlistAPI(productId);
        if (success) {
            setWishlistIds(prevIds => new Set(prevIds).add(productId));
        }
        return success;
    };

    const removeFromWishlist = async (productId) => {
        const success = await removeFromWishlistAPI(productId);

        if (success) {
            setWishlistIds(prevIds => {
                const newIds = new Set(prevIds);
                newIds.delete(productId);
                return newIds;
            });
        }
        return success;
    };

    const isWishlisted = (productId) => wishlistIds.has(productId);

    const value = {
        wishlistIds,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
        fetchWishlistIds,
        loading
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};
