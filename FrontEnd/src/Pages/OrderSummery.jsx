import React, { useState } from 'react';
import { useCart } from '../Component/CartContext'; // Adjust path if needed
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../utils/apiConfig';

const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const DetailedSummary = ({ selectedAddress, isGuest = false }) => {
    const { cart, loading } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);

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
        const productSlug = product.slug || product.name.replace(/\s+/g, '-').toLowerCase();
        navigate(`/product/${productSlug}`);
    };

    const subtotal = parsePrice(cart.cartTotal) || 0;
    
    // Calculate global cart discount based on subtotal tiers
    const calculateOrderDiscount = (total) => {
        if (total > 9999) return { percentage: 20, amount: Math.round(total * 0.20) };
        if (total > 4999) return { percentage: 15, amount: Math.round(total * 0.15) };
        if (total > 2999) return { percentage: 10, amount: Math.round(total * 0.10) };
        return { percentage: 0, amount: 0 };
    };

    const discountInfo = calculateOrderDiscount(subtotal);
    const finalTotal = subtotal - discountInfo.amount;

    const handlePayment = async () => {
        if (!selectedAddress) {
            alert("Please select or add a delivery address first.");
            return;
        }

        const res = await loadRazorpay();
        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Create order on server (Razorpay order)
            const orderRes = await axios.post(apiUrl('/v1/payment/create-order'), {
                amount: finalTotal
            });

            const { id: order_id, currency, amount } = orderRes.data;

            // 2. Open Razorpay Checkout
            const options = {
                key: "rzp_test_Sp9X2smiuL6n0F", // Hardcoded per user request, typically from env
                amount: amount,
                currency: currency,
                name: "Bunbun Clothing",
                description: "Order Payment",
                order_id: order_id,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        const verifyRes = await axios.post(apiUrl('/v1/payment/verify-payment'), {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verifyRes.status === 200) {
                            // 4. Create Order in DB
                            const orderPayload = {
                                userId: isGuest ? 'guest' : "6892e8456c2cbf8ecb95c1ea",
                                guestInfo: isGuest ? {
                                    name: selectedAddress?.guestName || 'Guest',
                                    phone: selectedAddress?.guestPhone || '',
                                } : undefined,
                                items: cart.product,
                                amount: {
                                    subtotal: subtotal,
                                    total: finalTotal
                                },
                                shippingAddress: selectedAddress,
                                billingAddress: selectedAddress,
                                paymentDetails: {
                                    paymentMethod: "Razorpay",
                                    transactionId: response.razorpay_payment_id
                                }
                            };

                            await axios.post(apiUrl('/v1/order/createOrder'), orderPayload);
                            
                            alert("Payment successful! Your order has been placed.");
                            // Normally you'd clear cart and navigate to a success page here
                            navigate("/"); 
                        }
                    } catch (err) {
                        console.error(err);
                        alert("Payment verification failed");
                    }
                },
                prefill: {
                    name: selectedAddress?.guestName || "User",
                    email: "",
                    contact: selectedAddress?.guestPhone || "9999999999"
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            console.error(err);
            alert("Could not initiate payment. Please try again.");
        } finally {
            setIsProcessing(false);
        }
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
                    <span>₹{subtotal.toLocaleString()}</span>
                </div>
                {discountInfo.amount > 0 && (
                    <div className="total-row-detailed text-success" style={{ display: 'flex', justifyContent: 'space-between', color: '#198754' }}>
                        <span>Extra {discountInfo.percentage}% OFF</span>
                        <span>-₹{discountInfo.amount.toLocaleString()}</span>
                    </div>
                )}
                <div className="total-row-detailed">
                    <span>Shipping</span>
                    <span className="shipping-free" style={{ color: '#198754', fontWeight: 'bold' }}>FREE</span>
                </div>
                <div className="total-row-detailed grand-total-detailed">
                    <strong>Total</strong>
                    <strong>₹{finalTotal.toLocaleString()}</strong>
                </div>
                <button 
                    className="btn btn-primary-filled checkout-btn" 
                    onClick={handlePayment} 
                    disabled={isProcessing}
                    style={{ width: '100%', marginTop: '15px' }}
                >
                    {isProcessing ? "Processing..." : "Proceed to Payment"}
                </button>
            </div>
        </div>
    );
};

export default DetailedSummary;