import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../utils/apiConfig';
import { getAuthUser } from '../utils/auth';
import '../Style/MyOrders.css';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const navigate = useNavigate();
    const user = getAuthUser();

    const fetchOrders = useCallback(async () => {
        try {
            const res = await axios.get(apiUrl(`/v1/order/user/${user._id}`));
            setOrders(res.data.data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    }, [user?._id]);

    useEffect(() => {
        if (!user?._id) {
            setLoading(false);
            return;
        }
        fetchOrders();
    }, [fetchOrders, user?._id]);

    const getStatusColor = (status) => {
        const colors = {
            'Pending': '#f59e0b',
            'Processing': '#3b82f6',
            'Shipped': '#8b5cf6',
            'Delivered': '#10b981',
            'Cancelled': '#ef4444',
            'Returned': '#6b7280'
        };
        return colors[status] || '#6b7280';
    };

    const getStatusIcon = (status) => {
        const icons = {
            'Pending': '⏳',
            'Processing': '⚙️',
            'Shipped': '🚚',
            'Delivered': '✅',
            'Cancelled': '❌',
            'Returned': '↩️'
        };
        return icons[status] || '📦';
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (dateStr) => {
        return new Date(dateStr).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const goToProduct = (product) => {
        if (!product) return;
        const slug = product.slug || product.name?.replace(/\s+/g, '-').toLowerCase();
        if (slug) navigate(`/product/${slug}`);
    };

    if (!user) {
        return (
            <div className="myorders-page">
                <div className="myorders-empty-state">
                    <div className="empty-icon">🔒</div>
                    <h2>Please Log In</h2>
                    <p>You need to be logged in to view your orders.</p>
                    <button className="myorders-shop-btn" onClick={() => navigate('/')}>
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="myorders-page">
                <div className="myorders-loader">
                    <div className="loader-spinner"></div>
                    <p>Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="myorders-page">
            <div className="myorders-container">
                {/* Header */}
                <div className="myorders-header">
                    <div className="myorders-header-left">
                        <button className="myorders-back-btn" onClick={() => navigate(-1)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7"/>
                            </svg>
                        </button>
                        <div>
                            <h1 className="myorders-title">My Orders</h1>
                            <p className="myorders-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="myorders-empty-state">
                        <div className="empty-icon">📦</div>
                        <h2>No orders yet</h2>
                        <p>Looks like you haven't placed any orders. Start shopping to see your orders here!</p>
                        <button className="myorders-shop-btn" onClick={() => navigate('/collections')}>
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="myorders-list">
                        {orders.map((order) => (
                            <div 
                                key={order._id} 
                                className={`myorders-card ${expandedOrder === order._id ? 'expanded' : ''}`}
                            >
                                {/* Card Header */}
                                <div 
                                    className="myorders-card-header"
                                    onClick={() => setExpandedOrder(
                                        expandedOrder === order._id ? null : order._id
                                    )}
                                >
                                    <div className="order-meta">
                                        <div className="order-id-row">
                                            <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                                            <span 
                                                className="order-status-badge"
                                                style={{ 
                                                    backgroundColor: `${getStatusColor(order.orderStatus)}15`,
                                                    color: getStatusColor(order.orderStatus),
                                                    borderColor: `${getStatusColor(order.orderStatus)}30`
                                                }}
                                            >
                                                {getStatusIcon(order.orderStatus)} {order.orderStatus}
                                            </span>
                                        </div>
                                        <div className="order-date-row">
                                            <span className="order-date">
                                                {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                                            </span>
                                            <span className="order-total">₹{order.amount?.total?.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Product Thumbnails Preview */}
                                    <div className="order-preview">
                                        <div className="order-thumbnails">
                                            {order.items?.slice(0, 3).map((item, idx) => (
                                                <div key={idx} className="order-thumb-wrapper">
                                                    <img
                                                        src={item.productId?.image || 'https://via.placeholder.com/60'}
                                                        alt={item.productId?.name || 'Product'}
                                                        className="order-thumb"
                                                    />
                                                    {item.quantity > 1 && (
                                                        <span className="thumb-qty">×{item.quantity}</span>
                                                    )}
                                                </div>
                                            ))}
                                            {order.items?.length > 3 && (
                                                <div className="order-thumb-more">
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <svg 
                                            className={`expand-arrow ${expandedOrder === order._id ? 'rotated' : ''}`}
                                            width="18" height="18" viewBox="0 0 24 24" fill="none" 
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                        >
                                            <polyline points="6 9 12 15 18 9"/>
                                        </svg>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedOrder === order._id && (
                                    <div className="myorders-card-body">
                                        {/* Items */}
                                        <div className="order-items-section">
                                            <h4 className="section-label">Items</h4>
                                            {order.items?.map((item, idx) => (
                                                <div key={idx} className="order-item-row" onClick={() => goToProduct(item.productId)}>
                                                    <div className="order-item-image">
                                                        <img
                                                            src={item.productId?.image || 'https://via.placeholder.com/80'}
                                                            alt={item.productId?.name || 'Product'}
                                                        />
                                                    </div>
                                                    <div className="order-item-info">
                                                        <span className="order-item-name">{item.productId?.name || 'Product'}</span>
                                                        <div className="order-item-details">
                                                            {item.size && <span className="order-item-size">Size: {item.size}</span>}
                                                            <span className="order-item-qty">Qty: {item.quantity}</span>
                                                        </div>
                                                    </div>
                                                    <span className="order-item-price">₹{item.price?.toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Price Breakdown */}
                                        <div className="order-price-section">
                                            <h4 className="section-label">Price Details</h4>
                                            <div className="price-row">
                                                <span>Subtotal</span>
                                                <span>₹{order.amount?.subtotal?.toLocaleString()}</span>
                                            </div>
                                            {order.amount?.shippingCharges > 0 && (
                                                <div className="price-row">
                                                    <span>Shipping</span>
                                                    <span>₹{order.amount.shippingCharges.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {order.amount?.couponDiscount > 0 && (
                                                <div className="price-row discount-row">
                                                    <span>Discount</span>
                                                    <span>-₹{order.amount.couponDiscount.toLocaleString()}</span>
                                                </div>
                                            )}
                                            <div className="price-row total-row">
                                                <strong>Total</strong>
                                                <strong>₹{order.amount?.total?.toLocaleString()}</strong>
                                            </div>
                                        </div>

                                        {/* Shipping Address */}
                                        <div className="order-address-section">
                                            <h4 className="section-label">Delivery Address</h4>
                                            <p className="order-address-text">
                                                {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                                            </p>
                                        </div>

                                        {/* Payment */}
                                        <div className="order-payment-section">
                                            <h4 className="section-label">Payment</h4>
                                            <div className="payment-info-row">
                                                <span>Method: {order.paymentDetails?.paymentMethod}</span>
                                                <span 
                                                    className="payment-status"
                                                    style={{ color: order.paymentDetails?.paymentStatus === 'Completed' ? '#10b981' : '#f59e0b' }}
                                                >
                                                    {order.paymentDetails?.paymentStatus}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
