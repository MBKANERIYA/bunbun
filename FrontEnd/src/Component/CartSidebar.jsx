import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaTimes } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "./CartContext";

const CartSidebar = () => {
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, loading } =
        useCart();
    const navigate = useNavigate();

    const handleCardClick = (item) => {
        if (!item || !item.name || !item._id) return; // safety check
        const productId = item._id;
        const productSlug = item.name.replace(/\s+/g, '-').toLowerCase();
        navigate(`/product/${productId}/${productSlug}`);
    };


    const handleRemove = (event, productId) => {
        event.stopPropagation();
        if (window.confirm("Are you sure you want to remove this item?")) {
            removeFromCart(productId);
        }
    };

    const handleViewCart = () => {
        closeCart();
        navigate("/cart");
    };
    const handleCheckout = () => {
        closeCart();
        navigate("/address");
    };

    const subtotal = cart?.cartTotal || 0;

    // ✅ Load recently viewed when sidebar opens
    useEffect(() => {
        if (isCartOpen) {
            const viewedItems =
                JSON.parse(localStorage.getItem("recentlyViewed")) || [];
            setRecentlyViewed(viewedItems);
        }
    }, [isCartOpen]);


    return (
        <>
            <div
                className={`cart-overlay ${isCartOpen ? "show" : ""}`}
                onClick={closeCart}
            ></div>

            <div className={`cart-sidebar ${isCartOpen ? "open" : ""}`}>
                <div className="cart-sidebar-header">
                    <h3 style={{ marginLeft: "230px" }}>Your Cart</h3>
                    <button
                        onClick={closeCart}
                        className="close-btn"
                        aria-label="Close cart"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div
                    className="cart-sidebar-body"
                >
                    <div className="recently-viewed-list">
                        <h5 className="ms-3">Recent View</h5>
                        {recentlyViewed.slice(0, 4).map((item) => (
                            <div
                                key={item._id}
                                className="recently-viewed-item"
                                onClick={() => handleCardClick(item)}
                            >
                                <img src={item.image} alt={item.name} className="recently-viewed-image" />
                                <div className="recently-viewed-details">
                                    <p className="recent-item-name">{item.name}</p>
                                    <p className="recent-item-price">
                                        ₹{Number(item.selling_price).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}

                    </div>

                    {/* Cart Items */}
                    <div
                        className="cart-sidebar-content"
                        style={{ padding: "10px", overflowY: "auto" }}
                    >
                        {loading ? (
                            <div className="cart-loader-container">
                                <div className="cart-loader"></div>
                            </div>
                        ) : !cart || cart.product.length === 0 ? (
                            <div className="empty-cart-content">
                                <FiShoppingCart className="empty-cart-icon" />
                                <h4>Your cart is empty</h4>
                                <p>Add items to see them here.</p>
                            </div>
                        ) : (
                            <div className="cart-items-list">
                                {cart.product.map((item) => (
                                    <div key={item.productId._id} className="cart-item" onClick={() => handleCardClick(item.productId)}>
                                        <img
                                            src={item.productId.image}
                                            alt={item.productId.name}
                                            className="cart-item-image"
                                        />
                                        <div className="cart-item-details">
                                            <p className="item-name">{item.productId.name}</p>
                                            <div className="item-price-quantity">
                                                <div className="quantity-controls">
                                                    <button
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            updateQuantity(item.productId._id, "decrement");
                                                        }}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span>{item.quantity}</span>
                                                    <button
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            updateQuantity(item.productId._id, "increment");
                                                        }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <p className="item-price">
                                                    ₹{Number(item.productId.selling_price).toLocaleString()}
                                                </p>
                                                <button
                                                    className="remove-item-btn"
                                                    onClick={(event) => handleRemove(event, item.productId._id)}
                                                    aria-label="Remove item"
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Footer only if cart has items */}
                        {cart && cart.product.length > 0 && (
                            <div className="cart-sidebar-footer">
                                <div className="subtotal">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <p className="footer-note">
                                    Taxes and shipping calculated at checkout.
                                </p>
                                <div className="footer-buttons">
                                    <button className="btn-view-cart" onClick={handleViewCart}>
                                        View Cart
                                    </button>
                                    <button className="btn-checkout" onClick={handleCheckout}>
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartSidebar;
