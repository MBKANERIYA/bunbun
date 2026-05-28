import React from 'react';
import { useCart } from '../Component/CartContext'; // Adjust path if needed
import { Link, useNavigate } from 'react-router-dom';

const DetailedSummary = () => {
    const { cart, loading } = useCart();

    const navigate = useNavigate();

    // Helper function to safely parse prices that might be strings (e.g., "₹5,971")
    const parsePrice = (price) => {
        if (typeof price === 'number') {
            return price;
        }
        // Removes all non-numeric characters except the decimal point
        const cleanedPrice = String(price).replace(/[^0-9.]/g, '');
        return Number(cleanedPrice) || 0;
    };

    if (loading) {
        return <div className="detailed-summary-card"><p>Loading...</p></div>;
    }

    if (!cart || cart.product.length === 0) {
        return (
            <div className="detailed-summary-card">
                <h3>Order Summary</h3>
                <p>Your cart is empty.</p>
            </div>
        );
    }

    const goToProductPage = (product) => {
        if (!product || !product._id || !product.name) return;
        const productId = product._id;
        const productSlug = product.name.replace(/\s+/g, '-').toLowerCase();
        navigate(`/product/${productId}/${productSlug}`);
    };

    return (
        <div className="detailed-summary-card" >
            <h3>Order Summary</h3>

            <div className="summary-items-list-detailed">
                {cart.product.map(item => {
                    // Use the robust parsePrice function
                    const sellingPrice = parsePrice(item.productId.selling_price);
                    const mrp = parsePrice(item.productId.mrp);

                    const discount = mrp > sellingPrice && mrp > 0
                        ? Math.round(((mrp - sellingPrice) / mrp) * 100)
                        : 0;

                    return (
                        <div key={item.productId._id} className="summary-item-detailed">
                            <div className="item-image-container-detailed" style={{ cursor: "pointer" }} onClick={() => goToProductPage(item.productId)}>
                                <img
                                    src={item.productId.image || 'https://via.placeholder.com/100'}
                                    alt={item.productId.name}
                                    className="item-image-detailed"
                                />
                                <span className="item-quantity-badge-detailed">{item.quantity}</span>
                            </div>
                            <div className="item-info-detailed">
                                <span className="item-name-detailed">{item.productId.name}</span>
                                <div className="item-price-details">
                                    <span className="selling-price">₹{sellingPrice.toLocaleString()}</span>
                                    {mrp > sellingPrice && (
                                        <span className="mrp">₹{mrp.toLocaleString()}</span>
                                    )}
                                    {/* This condition will now work correctly */}
                                    {discount > 0 && (
                                        <span className="discount-badgee">{discount}% OFF</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <hr className="summary-divider" />

            <div className="summary-totals-detailed">
                <div className="total-row-detailed">
                    <span>Subtotal</span>
                    <span>₹{(parsePrice(cart.cartTotal)).toLocaleString()}</span>
                </div>
                <div className="total-row-detailed">
                    <span>Shipping</span>
                    <span className="shipping-free">FREE</span>
                </div>
                <div className="total-row-detailed grand-total-detailed">
                    <strong>Total</strong>
                    <strong>₹{(parsePrice(cart.cartTotal)).toLocaleString()}</strong>
                </div>
                <Link className="btn btn-primary-filled checkout-btn">
                    Proceed to Payment
                </Link>
            </div>
        </div>
    );
};

export default DetailedSummary;