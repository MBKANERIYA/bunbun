import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../Component/CartContext";
import { useWishlist } from "../Component/WishlistContext";
import { getAuthUser } from "../utils/auth";
import { apiUrl } from "../utils/apiConfig";
import {
    FaShoppingCart,
    FaCreditCard,
    FaSpinner,
    FaStar,
    FaAngleDown,
    FaAngleUp,
    FaShare,
    FaBolt,
    FaTruck,
    FaMoneyBillAlt,
    FaRulerCombined
} from "react-icons/fa";
import ProductCard from "../Component/ProductCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const emptyRatings = { ratings: [], totalRatings: 0, averageRating: 0 };

const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(Number(value) || 0);

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();

    const [product, setProduct] = useState(null);
    const [authUser, setAuthUser] = useState(getAuthUser());
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isBuyingNow, setIsBuyingNow] = useState(false);
    const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
    const [ratings, setRatings] = useState(emptyRatings);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [reviewTitle, setReviewTitle] = useState("");
    const [image, setImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [openAccordion, setOpenAccordion] = useState("product_details");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showSizeChart, setShowSizeChart] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const getRatingBreakdown = () => {
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        if (ratings?.ratings) {
            ratings.ratings.forEach(r => {
                const rating = Number(r.userRating);
                if (counts[rating] !== undefined) {
                    counts[rating]++;
                }
            });
        }
        return counts;
    };
    const ratingBreakdown = getRatingBreakdown();

    const sizes = ["L", "XL", "XXL", "XXXL"];

    const toggleAccordion = (section) => {
        setOpenAccordion(openAccordion === section ? null : section);
    };

    const userId = authUser?._id || null;
    const isProductWishlisted = product?._id ? isWishlisted(product._id) : false;

    useEffect(() => {
        const syncAuthUser = () => setAuthUser(getAuthUser());

        window.addEventListener("authChanged", syncAuthUser);
        window.addEventListener("storage", syncAuthUser);

        return () => {
            window.removeEventListener("authChanged", syncAuthUser);
            window.removeEventListener("storage", syncAuthUser);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!product) return;

        const viewedItems = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
        const filteredItems = viewedItems.filter((item) => item._id !== product._id);
        const limitedItems = [product, ...filteredItems].slice(0, 6);

        localStorage.setItem("recentlyViewed", JSON.stringify(limitedItems));
        setRecentlyViewed(limitedItems.filter((item) => item._id !== id));
    }, [product, id]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(
                    apiUrl(`/v1/product/singleProduct/${id}`)
                );

                if (data.singleProduct) {
                    setProduct(data.singleProduct);
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };

        fetchProduct();
    }, [id]);

    const fetchRatings = async () => {
        try {
            const { data } = await axios.get(apiUrl(`/v1/rating/getRating/${id}`));
            setRatings(data || emptyRatings);
        } catch (error) {
            if (error.response?.status === 404) {
                setRatings(emptyRatings);
                return;
            }
            console.error("Error fetching ratings:", error);
        }
    };

    useEffect(() => {
        fetchRatings();
    }, [id]);

    const handleAddToCart = async () => {
        if (!selectedSize) {
            setMessage("Please select a size before adding to cart.");
            return;
        }
        setMessage("");
        setIsAddingToCart(true);
        await addToCart(product._id, selectedSize);
        setIsAddingToCart(false);
    };

    const handleBuyNow = async () => {
        if (!selectedSize) {
            setMessage("Please select a size before buying.");
            return;
        }
        setMessage("");
        setIsBuyingNow(true);
        const added = await addToCart(product._id, selectedSize);
        setIsBuyingNow(false);
        if (added) navigate("/cart");
    };

    const handleToggleWishlist = async () => {
        if (!product?._id) return;

        setIsTogglingWishlist(true);
        if (isProductWishlisted) {
            await removeFromWishlist(product._id);
        } else {
            await addToWishlist(product._id);
        }
        setIsTogglingWishlist(false);
    };

    const handleSubmitRating = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!userId) {
            setMessage("Please login to submit a review.");
            return;
        }

        if (!rating) {
            setMessage("Please select a rating before submitting.");
            return;
        }

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append("userId", userId);
            formData.append("productId", id);
            formData.append("userRating", rating);
            const finalReview = reviewTitle ? `**${reviewTitle}**\n${review}` : review;
            formData.append("userReview", finalReview.trim());
            if (image) formData.append("productImage", image);

            const { data } = await axios.post(
                apiUrl("/v1/rating/addRating"),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setMessage(data.message || "Review submitted successfully.");
            setRating(0);
            setReview("");
            setReviewTitle("");
            setImage(null);
            await fetchRatings();
        } catch (error) {
            console.error("Error submitting rating:", error);
            setMessage(error.response?.data?.message || "Error submitting rating");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!product) {
        return <div className="loading-screen">Loading Your Style...</div>;
    }

    const discount =
        Number(product.mrp) > Number(product.selling_price)
            ? Math.round(((product.mrp - product.selling_price) / product.mrp) * 100)
            : 0;

    const reviewSliderSettings = {
        dots: true,
        infinite: ratings.ratings.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: ratings.ratings.length > 1,
        autoplay: ratings.ratings.length > 1,
        autoplaySpeed: 5000
    };

    const productImageSliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: false
    };

    return (
        <div className="product-page-container">
            <div className="product-grid-unique">
                <div>
                    {isMobile ? (
                        <div className="product-image-slider-mobile mb-4">
                            <Slider {...productImageSliderSettings}>
                                {[product.image, ...(product.images || [])].filter(Boolean).map((img, idx) => (
                                    <div key={idx} className="grid-image-item">
                                        <img src={img} alt={`${product.name} - view ${idx + 1}`} style={{ width: '100%', height: 'auto', aspectRatio: '3/4', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    ) : (
                        <div className="product-image-grid-2x2">
                            {[product.image, ...(product.images || [])].filter(Boolean).map((img, idx) => (
                                <div key={idx} className="grid-image-item">
                                    <img src={img} alt={`${product.name} - view ${idx + 1}`} />
                                </div>
                            ))}
                        </div>
                    )}

                </div>

                <div className="product-info-unique">
                    <div className="title-row">
                        <h1 className="product-title-unique">{product.name}</h1>
                        <button className="share-btn"><FaShare /></button>
                    </div>

                    <div className="price-container-unique">
                        <span className="original-price">{formatPrice(product.mrp)}</span>
                        <span className="current-price">{formatPrice(product.selling_price)}</span>
                        {discount > 0 && (
                            <span className="sale-badge">SALE</span>
                        )}
                    </div>
                    <p className="taxes-info-unique">Inclusive of all taxes.</p>

                    <div className="rating-row">
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    size={16}
                                    color={star <= (ratings.averageRating || 0) ? "#0d3b66" : "#d1d5db"}
                                />
                            ))}
                        </div>
                        <span className="rating-count">({ratings.totalRatings || 0})</span>
                    </div>

                    <div className="offers-container">
                        <div className="offer-box">
                            <div className="offer-header">
                                <span className="offer-icon">%</span> Extra 10% off
                            </div>
                            <div className="offer-body">
                                On orders above <strong>₹2,999</strong>
                            </div>
                        </div>
                        <div className="offer-box">
                            <div className="offer-header">
                                <span className="offer-icon">%</span> Extra 15% off
                            </div>
                            <div className="offer-body">
                                On orders above <strong>₹4,999</strong>
                            </div>
                        </div>
                        <div className="offer-box">
                            <div className="offer-header">
                                <span className="offer-icon">%</span> Extra 20% off
                            </div>
                            <div className="offer-body">
                                On orders above <strong>₹9,999</strong>
                            </div>
                        </div>
                    </div>

                    <div className="delivery-details-section">
                        <h4>Check Delivery Details</h4>
                        <div className="pincode-input-group">
                            <input type="text" placeholder="380001" />
                            <button className="check-btn">Check</button>
                        </div>
                        <ul className="delivery-info-list">
                            <li><FaTruck className="icon" /> Delivery between <strong className="green-text">8th and 9th Jun</strong></li>
                            <li><FaMoneyBillAlt className="icon" /> Cash On Delivery <strong className="green-text">available</strong></li>
                        </ul>
                    </div>

                    <div className="size-selector-unique mb-4">
                        <div className="size-header">
                            <h4>SIZE</h4>
                            <button className="size-chart-btn" onClick={() => setShowSizeChart(true)}><FaRulerCombined /> Size Chart</button>
                        </div>
                        <div className="size-options">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedSize(size);
                                        if (message.includes("size")) setMessage("");
                                    }}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        {message && message.includes("size") && (
                            <p className="text-danger mt-2" style={{ color: 'red', fontSize: '0.9rem' }}>{message}</p>
                        )}
                    </div>

                    <div className="actions-container-stacked">
                        <button
                            className="btn-add-to-cart"
                            onClick={handleAddToCart}
                            disabled={isAddingToCart || isBuyingNow}
                        >
                            {isAddingToCart ? <FaSpinner className="spinner" /> : null}
                            ADD TO CART
                        </button>
                        <button
                            className="btn-buy-now"
                            onClick={handleBuyNow}
                            disabled={isAddingToCart || isBuyingNow}
                        >
                            {isBuyingNow ? <FaSpinner className="spinner" /> : null}
                            BUY IT NOW
                        </button>
                    </div>

                    <div className="row">
                        <img
                            src="https://sudathi.com/cdn/shop/files/Free_Shipping_dfhb_b36c903d-a594-4dd6-b7e9-ea12d96cd2e7.png?height=200&v=1757303647"
                            style={{ width: "100%", objectFit: "cover", borderRadius: "20px" }}
                            alt="Free shipping"
                        />
                    </div>

                    <div className="details-accordion mt-4">
                        {/* DESCRIPTION */}
                        {product.description && (
                            <div className="detail-item">
                                <div className="detail-item-header" onClick={() => toggleAccordion('description')}>
                                    <h3>DESCRIPTION</h3>
                                    {openAccordion === 'description' ? <FaAngleUp /> : <FaAngleDown />}
                                </div>
                                {openAccordion === 'description' && (
                                    <div className="detail-item-content">
                                        <p>{product.description}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* PRODUCT DETAILS */}
                        <div className="detail-item">
                            <div className="detail-item-header" onClick={() => toggleAccordion('product_details')}>
                                <h3>PRODUCT DETAILS</h3>
                                {openAccordion === 'product_details' ? <FaAngleUp /> : <FaAngleDown />}
                            </div>
                            {openAccordion === 'product_details' && (
                                <div className="detail-item-content">
                                    <p className="mb-3">Pictures used are only for references</p>
                                    <ul>
                                        {product.sku && <li><strong>SKU :</strong> {product.sku}</li>}
                                        {product.productType && <li><strong>Type :</strong> {product.productType}</li>}
                                        
                                        {/* Blouse Fields */}
                                        {product.blouseType && <li><strong>Blouse Type :</strong> {product.blouseType}</li>}
                                        {product.blouseColor && <li><strong>Blouse Color :</strong> {product.blouseColor}</li>}
                                        {product.blouseFabric && <li><strong>Blouse Fabric :</strong> {product.blouseFabric}</li>}
                                        {product.blouseWork && <li><strong>Blouse Work :</strong> {product.blouseWork}</li>}
                                        {product.sleeveLength && <li><strong>Sleeve Length :</strong> {product.sleeveLength}</li>}
                                        {(!product.sizeDetails || product.sizeDetails.length === 0) && product.bustSize && <li><strong>Bust Size :</strong> {product.bustSize}</li>}
                                        {(!product.sizeDetails || product.sizeDetails.length === 0) && product.blouseLength && <li><strong>Blouse Length :</strong> {product.blouseLength}</li>}
                                        {product.sizeDetails && product.sizeDetails.some(d => d.bust || d.waist || d.shoulder || d.length) && !selectedSize && <li><strong style={{color:'var(--primary-color)'}}>Select a size to view precise measurements (Bust, Waist, Shoulder, Length)</strong></li>}
                                        {product.sizeDetails && product.sizeDetails.map(detail => {
                                            if (selectedSize && detail.size === selectedSize) {
                                                return (
                                                    <React.Fragment key={detail.size}>
                                                        {detail.bust && <li><strong>Bust :</strong> {detail.bust} inch</li>}
                                                        {detail.waist && <li><strong>Waist :</strong> {detail.waist} inch</li>}
                                                        {detail.shoulder && <li><strong>Shoulder :</strong> {detail.shoulder} inch</li>}
                                                        {detail.length && <li><strong>Length :</strong> {detail.length} inch</li>}
                                                    </React.Fragment>
                                                )
                                            }
                                            return null;
                                        })}
                                        {product.salesPackage && <li><strong>Sales Package :</strong> {product.salesPackage}</li>}
                                        
                                        {/* Shapewear Fields */}
                                        {product.bottomColor && <li><strong>Bottom Color :</strong> {product.bottomColor}</li>}
                                        {product.bottomFabric && <li><strong>Bottom Fabric :</strong> {product.bottomFabric}</li>}
                                        {product.bottomLength && <li><strong>Bottom Length :</strong> {product.bottomLength}</li>}
                                        {product.bottomWork && <li><strong>Bottom Work :</strong> {product.bottomWork}</li>}
                                        {product.waistType && <li><strong>Waist Type :</strong> {product.waistType}</li>}
                                        {product.bottomHip && <li><strong>Bottom Hip :</strong> {product.bottomHip}</li>}
                                        {product.bottomWaist && <li><strong>Bottom Waist :</strong> {product.bottomWaist}</li>}
                                        
                                        {/* Common Fields */}
                                        {product.washAndCare && <li><strong>Wash And Care :</strong> {product.washAndCare}</li>}
                                        {product.weight && <li><strong>Weight :</strong> {product.weight}</li>}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* RETURN AND EXCHANGE */}
                        <div className="detail-item">
                            <div className="detail-item-header" onClick={() => toggleAccordion('return')}>
                                <h3>RETURN AND EXCHANGE</h3>
                                {openAccordion === 'return' ? <FaAngleUp /> : <FaAngleDown />}
                            </div>
                            {openAccordion === 'return' && (
                                <div className="detail-item-content">
                                    <p>Easy 7-day return and exchange policy. Please ensure the product is unused with original tags attached.</p>
                                </div>
                            )}
                        </div>

                        {/* SHIPPING INFORMATION */}
                        <div className="detail-item">
                            <div className="detail-item-header" onClick={() => toggleAccordion('shipping')}>
                                <h3>SHIPPING INFORMATION</h3>
                                {openAccordion === 'shipping' ? <FaAngleUp /> : <FaAngleDown />}
                            </div>
                            {openAccordion === 'shipping' && (
                                <div className="detail-item-content">
                                    <p>Standard delivery takes 5-7 business days. Free shipping on orders above ₹999.</p>
                                </div>
                            )}
                        </div>

                        {/* SELLER INFORMATION */}
                        <div className="detail-item">
                            <div className="detail-item-header" onClick={() => toggleAccordion('seller')}>
                                <h3>SELLER INFORMATION</h3>
                                {openAccordion === 'seller' ? <FaAngleUp /> : <FaAngleDown />}
                            </div>
                            {openAccordion === 'seller' && (
                                <div className="detail-item-content">
                                    <p>Sold by Bunbun Clothing Store. Authentic products guaranteed.</p>
                                </div>
                            )}
                        </div>

                        {/* NEED HELP? */}
                        <div className="detail-item">
                            <div className="detail-item-header" onClick={() => toggleAccordion('help')}>
                                <h3>NEED HELP?</h3>
                                {openAccordion === 'help' ? <FaAngleUp /> : <FaAngleDown />}
                            </div>
                            {openAccordion === 'help' && (
                                <div className="detail-item-content">
                                    <p>Contact our support team at support@bunbunclothing.com or call +91-XXXXXXXXXX.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="review-summary-box-wrapper mt-5 px-3">
                <div className="review-summary-box shadow-sm rounded bg-white p-4 mx-auto" style={{maxWidth: '900px'}}>
                    <h3 className="text-center mb-4" style={{fontFamily: 'var(--font-body)', fontWeight: 600, color: '#1a202c'}}>Customer Reviews</h3>
                    <div className="d-flex flex-wrap justify-content-between align-items-center" style={{gap: '2rem'}}>
                        
                        {/* Left Column: Average & Count */}
                        <div className="text-center" style={{flex: '1', minWidth: '200px'}}>
                            <div className="d-flex justify-content-center align-items-center gap-2 mb-1">
                                <div className="stars d-flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar key={star} size={18} color={star <= (ratings.averageRating || 0) ? "#0d3b66" : "#e2e8f0"} />
                                    ))}
                                </div>
                                <span style={{fontSize: '0.95rem', color: '#4a5568'}}>{ratings.averageRating || 0} out of 5</span>
                            </div>
                            <div style={{fontSize: '0.9rem', color: '#4a5568'}}>
                                Based on {ratings.totalRatings || 0} review{ratings.totalRatings !== 1 ? 's' : ''} <span style={{color: '#38a169', fontWeight: 'bold', marginLeft: '4px'}}>☑</span>
                            </div>
                        </div>

                        {/* Middle Column: Progress Bars */}
                        <div style={{flex: '1.5', minWidth: '250px'}}>
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = ratingBreakdown[star];
                                const percentage = ratings.totalRatings > 0 ? (count / ratings.totalRatings) * 100 : 0;
                                return (
                                    <div key={star} className="d-flex align-items-center gap-2 mb-1" style={{fontSize: '0.85rem'}}>
                                        <div className="stars d-flex">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <FaStar key={s} size={12} color={s <= star ? "#0d3b66" : "#e2e8f0"} />
                                            ))}
                                        </div>
                                        <div style={{flex: 1, height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden'}}>
                                            <div style={{width: `${percentage}%`, height: '100%', backgroundColor: '#0d3b66', borderRadius: '4px'}}></div>
                                        </div>
                                        <div style={{width: '20px', textAlign: 'right', color: '#4a5568'}}>{count}</div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right Column: Button */}
                        <div className="text-center" style={{flex: '1', minWidth: '200px'}}>
                            <button 
                                onClick={() => setShowReviewForm(true)}
                                style={{backgroundColor: '#0d3b66', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '20px', fontWeight: 600, fontSize: '0.9rem'}}
                            >
                                Write a store review
                            </button>
                        </div>
                    </div>
                    
                    {/* Review Form Modal */}
                    {showReviewForm && (
                        <div className="modal-overlay" onClick={() => setShowReviewForm(false)} style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, 
                            display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem'
                        }}>
                            <div className="modal-content shadow-lg bg-white" onClick={(e) => e.stopPropagation()} style={{
                                position: 'relative', borderRadius: '12px', 
                                padding: '2rem', maxWidth: '600px', width: '100%',
                                display: 'flex', flexDirection: 'column'
                            }}>
                                {/* Product Title */}
                                <h4 className="text-center mb-4" style={{fontFamily: 'var(--font-body)', fontWeight: 700, color: '#333'}}>
                                    {product.name}
                                </h4>
                                
                                <form onSubmit={handleSubmitRating}>
                                    {/* Star Rating with Poor/Great */}
                                    <div className="d-flex justify-content-center align-items-center mb-4 position-relative">
                                        <div className="d-flex" style={{gap: '0.5rem'}}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    className="bg-transparent border-0 p-0"
                                                    style={{cursor: 'pointer'}}
                                                    onClick={() => setRating(star)}
                                                >
                                                    <FaStar size={40} color={star <= rating ? "#0d3b66" : "#e2e8f0"} />
                                                </button>
                                            ))}
                                        </div>
                                        {/* Labels */}
                                        <span style={{position: 'absolute', bottom: '-20px', left: 'calc(50% - 95px)', fontSize: '0.8rem', color: '#666', fontWeight: 500}}>Poor</span>
                                        <span style={{position: 'absolute', bottom: '-20px', right: 'calc(50% - 95px)', fontSize: '0.8rem', color: '#666', fontWeight: 500}}>Great</span>
                                    </div>

                                    {/* Review Content */}
                                    <div className="mb-3" style={{marginTop: '2.5rem'}}>
                                        <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#333', fontWeight: 500}}>Review content</label>
                                        <textarea
                                            value={review}
                                            onChange={(e) => setReview(e.target.value)}
                                            placeholder="Start writing here..."
                                            className="form-control"
                                            rows="4"
                                            style={{fontSize: '0.95rem', padding: '0.75rem', borderColor: '#d1d5db', borderRadius: '6px'}}
                                        />
                                    </div>

                                    {/* Review Title */}
                                    <div className="mb-3">
                                        <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#333', fontWeight: 500}}>Review Title</label>
                                        <input
                                            type="text"
                                            value={reviewTitle}
                                            onChange={(e) => setReviewTitle(e.target.value)}
                                            placeholder="Give your review a title"
                                            className="form-control"
                                            style={{fontSize: '0.95rem', padding: '0.75rem', borderColor: '#d1d5db', borderRadius: '6px'}}
                                        />
                                    </div>

                                    {/* Optional Image */}
                                    <div className="mb-4">
                                        <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#333', fontWeight: 500}}>Attach an Image (Optional)</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setImage(e.target.files[0])}
                                            className="form-control"
                                            style={{fontSize: '0.9rem'}}
                                        />
                                    </div>

                                    {/* Disclaimer */}
                                    <p className="text-center" style={{fontSize: '0.75rem', color: '#718096', lineHeight: '1.4', marginBottom: '2rem'}}>
                                        We'll only contact you about your review if necessary. By submitting your review, you agree to our <span style={{textDecoration: 'underline'}}>terms and conditions</span> and <span style={{textDecoration: 'underline'}}>privacy policy</span>.
                                    </p>

                                    {/* Actions */}
                                    <div className="d-flex justify-content-between align-items-center">
                                        <button type="button" onClick={() => setShowReviewForm(false)} style={{background: 'none', border: 'none', fontSize: '0.95rem', color: '#4a5568', cursor: 'pointer', padding: 0}}>
                                            &larr; Back
                                        </button>
                                        <button type="submit" style={{backgroundColor: '#0d3b66', color: 'white', border: 'none', padding: '0.6rem 2rem', borderRadius: '4px', fontWeight: 600, fontSize: '0.95rem'}} disabled={isSubmitting}>
                                            {isSubmitting ? <FaSpinner className="spinner" /> : "Next"}
                                        </button>
                                    </div>
                                    
                                    {message && <p className="text-center mt-3 text-danger mb-0" style={{fontSize: '0.9rem'}}>{message}</p>}
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* Existing individual reviews slider */}
                {ratings.ratings.length > 0 && (
                    <div className="mt-4 mx-auto" style={{maxWidth: '900px'}}>
                        <Slider {...reviewSliderSettings}>
                            {ratings.ratings.map((r, index) => (
                                <div key={r._id || index} className="review-slide-wrapper">
                                    <div className="review-card border p-3 rounded mb-2">
                                        <div className="stars mb-1 d-flex justify-content-center">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar
                                                    key={star}
                                                    size={18}
                                                    color={star <= Number(r.userRating) ? "#facc15" : "#d1d5db"}
                                                />
                                            ))}
                                        </div>
                                        <p className="review-user text-center">
                                            <strong>
                                                {r.userId?.fullName?.firstName || "Anonymous"}{" "}
                                                {r.userId?.fullName?.lastName || ""}
                                            </strong>
                                        </p>
                                        {r.userReview && <p className="review-text text-center">{r.userReview}</p>}
                                        {r.productImage && (
                                            <img
                                                src={r.productImage}
                                                alt="Customer review"
                                                className="review-image mx-auto mt-2"
                                                style={{maxWidth: '150px', borderRadius: '8px'}}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                )}
            </div>

            {recentlyViewed.length > 0 && (
                <div className="recently-viewed-section">
                    <h2 className="section-title">Recently Viewed</h2>
                    <div className="products-grid">
                        {recentlyViewed.slice(0, 4).map((item) => (
                            <ProductCard key={item._id} product={item} />
                        ))}
                    </div>
                </div>
            )}

            {showSizeChart && (
                <div className="modal-overlay" onClick={() => setShowSizeChart(false)} style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, 
                    display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem'
                }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
                        position: 'relative', background: '#fff', borderRadius: '8px', 
                        padding: '1rem', maxWidth: '500px', width: '100%'
                    }}>
                        <button onClick={() => setShowSizeChart(false)} style={{
                            position: 'absolute', top: '10px', right: '15px', 
                            background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'
                        }}>×</button>
                        <h4 style={{ textAlign: 'center', marginBottom: '1rem' }}>Size Chart</h4>
                        <img 
                            src="https://res.cloudinary.com/drizf8zcc/image/upload/v1780384652/products/lwgknbdrr3omwz0muh2d.jpg" 
                            alt="Size Chart" 
                            style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
