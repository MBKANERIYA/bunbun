import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaSpinner } from "react-icons/fa";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, showWishlistIcon = true }) => {
    const [hovered, setHovered] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

    const { addToCart } = useCart();
    const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
    const navigate = useNavigate();


    const productId = product._id;
    const isProductWishlisted = isWishlisted(productId);

    const productSlug = (product.name || 'product').replace(/ /g, '-').toLowerCase();

    const handleToggleWishlist = async (e) => {
        e.stopPropagation(); // Prevents navigation
        setIsTogglingWishlist(true);
        if (isProductWishlisted) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
        setIsTogglingWishlist(false);
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation(); // Prevents navigation
        setIsAddingToCart(true);
        await addToCart(productId);
        setIsAddingToCart(false);
    };

    const handleCardClick = () => {
        navigate(`/product/${productId}/${productSlug}`);
    };

    const mrp = Number(product.mrp);
    const price = Number(product.selling_price);
    const discount = !isNaN(mrp) && !isNaN(price) && mrp > price
        ? Math.round(((mrp - price) / mrp) * 100)
        : 0;

    return (
        <div
            className="product-card"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleCardClick}
            style={{ cursor: "pointer" }}
        >
            <div className="card-image-container">
                <img
                    src={hovered && product.hoverImage ? product.hoverImage : product.image}
                    alt={product.name}
                    className="product-image"
                />

                {showWishlistIcon && (
                    <div className="wishlist-icon" onClick={handleToggleWishlist}>
                        {isTogglingWishlist ? (
                            <FaSpinner className="animate-spin" />
                        ) : isProductWishlisted ? (
                            <FaHeart color="#FE9A60" />
                        ) : (
                            <FaRegHeart />
                        )}
                    </div>
                )}

                {discount > 0 && (
                    <div className="discount-badge">-{discount}%</div>
                )}

                <div className="card-actions">
                    <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={isAddingToCart}>
                        {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                    </button>
                </div>
            </div>
            <div className="card-content">
                <h3 className="product-name">{product.name}</h3>
                <div className="price-section">
                    <span className="price">₹{price.toLocaleString()}</span>
                    {mrp > price && <span className="mrp">₹{mrp.toLocaleString()}</span>}
                </div>
            </div>
        </div>
    );
};

export default React.memo(ProductCard);
