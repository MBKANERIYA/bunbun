import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ProductCard from '../Component/ProductCard';
import { useWishlist } from '../Component/WishlistContext';
import { getAuthUserId } from '../utils/auth';

const EmptyWishlist = () => (
    <div className="empty-wishlist">
        <FaHeart className="empty-wishlist-icon" />
        <h2 className="empty-wishlist-title">Your Wishlist is Empty</h2>
        <p className="empty-wishlist-subtitle">Start exploring and save your favorites!</p>
        <Link to="/" className="btn-primary">
            Continue Shopping
        </Link>
    </div>
);

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(getAuthUserId());
    const { removeFromWishlist, wishlistIds } = useWishlist();

    useEffect(() => {
        const syncAuthUser = () => setUserId(getAuthUserId());

        window.addEventListener("authChanged", syncAuthUser);
        window.addEventListener("storage", syncAuthUser);

        return () => {
            window.removeEventListener("authChanged", syncAuthUser);
            window.removeEventListener("storage", syncAuthUser);
        };
    }, []);

    useEffect(() => {
        const fetchWishlist = async () => {
            if (!userId) {
                setWishlistItems([]);
                setError(null);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:4000/v1/wishlist/getWishlist/${userId}`);
                setWishlistItems(response.data?.wishlist?.product || []);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch wishlist:", err);
                setError("Could not load your wishlist.");
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, [userId, wishlistIds]);

    const handleRemoveFromWishlist = async (productIdToRemove) => {
        const success = await removeFromWishlist(productIdToRemove);
        if (success) {
            setWishlistItems(prevItems =>
                prevItems.filter(item => item.productId?._id !== productIdToRemove)
            );
        }
    };


    if (loading) return <div className="loading-spinner"></div>;
    if (error) return <div className="error-message">{error}</div>;
    if (wishlistItems.length === 0) return <EmptyWishlist />;

    return (
        <div className="wishlist-page">
            <div className="wishlist-header">
                <h1>My Wishlist</h1>
                <span>{wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}</span>
            </div>

            <div className="wishlist-grid">
                {wishlistItems.filter(({ productId }) => productId).map(({ productId }) => (
                    <div key={productId._id} className="wishlist-item-wrapper">
                        <ProductCard product={productId} showWishlistIcon={false} />
                        <button
                            className="wishlist-remove-btn"
                            onClick={() => handleRemoveFromWishlist(productId._id)}
                            aria-label="Remove from wishlist"
                        >
                            <FaTrashAlt />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
