import React, { useEffect, useMemo, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { FiShoppingCart, FiLoader } from "react-icons/fi";
import { useCart } from './CartContext'; // 1. IMPORT THE CART HOOK
import { Link, useNavigate } from "react-router-dom";

const EmptyCart = () => (
    <div className="empty-cart-container">
        <FiShoppingCart className="empty-cart-icon" />
        <h2 className="empty-cart-title">Your Cart is Empty</h2>
        <p className="empty-cart-subtitle">Looks like you haven't added anything to your cart yet.</p>
        <button className="btn btn-primary-filled" onClick={() => window.location.href = '/'}>
            Continue Shopping
        </button>
    </div>
);

const ConfirmationModal = ({ onConfirm, onCancel }) => (
    <div className="modal-overlay">
        <div className="modal-content">
            <h4>Remove Item</h4>
            <p>Are you sure you want to remove this item from your cart?</p>
            <div className="modal-actions">
                <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                <button className="btn btn-danger" onClick={onConfirm}>Remove</button>
            </div>
        </div>
    </div>
);


const Cart = () => {
    const { cart, loading, updateQuantity, removeFromCart } = useCart();

    const [showModal, setShowModal] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);
    const [activeOffer, setActiveOffer] = useState(0);
    const navigate = useNavigate();
    const offers = useMemo(() => [
        { title: "Extra 10% off", detail: "On orders above ₹2,999" },
        { title: "Extra 15% off", detail: "On orders above ₹4,999" },
        { title: "Extra 20% off", detail: "On orders above ₹9,999" },
    ], []);

    const handleRemoveFromCart = async () => {
        if (!itemToRemove) return;

        await removeFromCart(itemToRemove);

        setShowModal(false);
        setItemToRemove(null);
    };

    const promptToRemove = (productId) => {
        setItemToRemove(productId);
        setShowModal(true);
    };

    const goToProductPage = (product) => {
        if (!product || !product._id || !product.name) return;
        const productId = product._id;
        const productSlug = product.name.replace(/\s+/g, '-').toLowerCase();
        navigate(`/product/${productId}/${productSlug}`);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveOffer((current) => (current + 1) % offers.length);
        }, 3500);

        return () => clearInterval(timer);
    }, [offers.length]);

    const showPreviousOffer = () => {
        setActiveOffer((current) => (current - 1 + offers.length) % offers.length);
    };

    const showNextOffer = () => {
        setActiveOffer((current) => (current + 1) % offers.length);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <FiLoader className="loading-spinner" />
                <p>Loading Your Cart...</p>
            </div>
        );
    }

    if (!cart || cart.product.length === 0) {
        return <EmptyCart />;
    }

    const subtotal = cart.cartTotal || 0;
    
    // Calculate global cart discount based on subtotal tiers
    const calculateOrderDiscount = (total) => {
        if (total > 9999) return { percentage: 20, amount: Math.round(total * 0.20) };
        if (total > 4999) return { percentage: 15, amount: Math.round(total * 0.15) };
        if (total > 2999) return { percentage: 10, amount: Math.round(total * 0.10) };
        return { percentage: 0, amount: 0 };
    };

    const discountInfo = calculateOrderDiscount(subtotal);
    const finalTotal = subtotal - discountInfo.amount;

    return (
        <div className="cart-page-container">
            {showModal && (
                <ConfirmationModal
                    onConfirm={handleRemoveFromCart}
                    onCancel={() => setShowModal(false)}
                />
            )}

            <h1 className="cart-header">Your Shopping Cart</h1>
            <div className="cart-layout">
                <div className="cart-items-section">
                    <div className="cart-items-header">
                        <span className="header-product">Product</span>
                        <span className="header-quantity">Quantity</span>
                        <span className="header-total">Total</span>
                        <span></span>
                    </div>

                    <div className="cart-items-list">
                        {cart.product.map((item) => {
                            const sellingPrice = Number(item.productId.selling_price);
                            const mrp = Number(item.productId.mrp);
                            const discount = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

                            return (
                                <div key={item.productId._id} className="cart-item-row">
                                    <div className="item-product-info">
                                        <div className="item-image-wrapper">
                                            <img src={item.productId.image} style={{ cursor: "pointer" }} onClick={() => goToProductPage(item.productId)} alt={item.productId.name} className="item-image" />
                                        </div>
                                        <div className="item-details">
                                            <h4 className="item-name">{item.productId.name}</h4>
                                            <div className="item-price-container">
                                                <span className="item-price">₹{sellingPrice.toLocaleString()}</span>
                                                {mrp > sellingPrice && (
                                                    <span className="item-mrp">₹{mrp.toLocaleString()}</span>
                                                )}
                                                {discount > 0 && (
                                                    <span className="item-discount-badge">{discount}% OFF</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="item-quantity-controls">
                                        {/* 5. CALL `updateQuantity` FROM CONTEXT DIRECTLY */}
                                        <button
                                            onClick={() => updateQuantity(item.productId._id, "decrement")}
                                            disabled={item.quantity <= 1}
                                        ><span>-</span></button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.productId._id, "increment")}><span>+</span></button>
                                    </div>
                                    <div className="item-total-price">
                                        <span>₹{item.totalPrice.toLocaleString()}</span>
                                    </div>
                                    <button className="item-remove-btn" onClick={() => promptToRemove(item.productId._id)}>
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="order-summary-section">
                    <div className="cart-offer-slider" aria-label="Cart offers">
                        <button className="offer-nav-btn" type="button" onClick={showPreviousOffer} aria-label="Previous offer">
                            ‹
                        </button>
                        <div className="offer-track">
                            {offers.map((offer, index) => (
                                <div
                                    key={offer.title}
                                    className={`offer-slide ${index === activeOffer ? "active" : ""}`}
                                    aria-hidden={index !== activeOffer}
                                >
                                    <span className="offer-title">{offer.title}</span>
                                    <span className="offer-detail">{offer.detail}</span>
                                </div>
                            ))}
                        </div>
                        <button className="offer-nav-btn" type="button" onClick={showNextOffer} aria-label="Next offer">
                            ›
                        </button>
                        <div className="offer-dots">
                            {offers.map((offer, index) => (
                                <button
                                    key={offer.title}
                                    type="button"
                                    className={index === activeOffer ? "active" : ""}
                                    onClick={() => setActiveOffer(index)}
                                    aria-label={`Show offer ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="summary-card mt-4">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal ({cart.product.length} items)</span>
                            <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        {discountInfo.amount > 0 && (
                            <div className="summary-row discount-row text-success" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                <span>Extra {discountInfo.percentage}% OFF</span>
                                <span>-₹{discountInfo.amount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="summary-row" style={{ marginTop: '10px' }}>
                            <span>Shipping</span>
                            <span className="text-success">FREE</span>
                        </div>
                        <hr />
                        <div className="summary-row total-row">
                            <strong>Total</strong>
                            <strong>₹{finalTotal.toLocaleString()}</strong>
                        </div>
                        <Link to="/address" className="btn btn-primary-filled checkout-btn">
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
