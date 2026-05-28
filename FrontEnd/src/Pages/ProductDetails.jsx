import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../Component/CartContext";
import { useWishlist } from "../Component/WishlistContext";
import { getAuthUser } from "../utils/auth";
import {
    FaShoppingCart,
    FaCreditCard,
    FaSpinner,
    FaStar,
    FaHeart,
    FaRegHeart
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
    const [image, setImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [recentlyViewed, setRecentlyViewed] = useState([]);

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
                    `http://localhost:4000/v1/product/singleProduct/${id}`
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
            const { data } = await axios.get(`http://localhost:4000/v1/rating/getRating/${id}`);
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
        setIsAddingToCart(true);
        await addToCart(product._id);
        setIsAddingToCart(false);
    };

    const handleBuyNow = async () => {
        setIsBuyingNow(true);
        const added = await addToCart(product._id);
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
            formData.append("userReview", review.trim());
            if (image) formData.append("productImage", image);

            const { data } = await axios.post(
                "http://localhost:4000/v1/rating/addRating",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setMessage(data.message || "Review submitted successfully.");
            setRating(0);
            setReview("");
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

    return (
        <div className="product-page-container">
            <div className="product-grid-unique">
                <div>
                    <div className="product-image-grid">
                        <div className="image-container">
                            <img src={product.image} alt={`${product.name} - view 1`} />
                        </div>
                        {product.hoverImage && (
                            <div className="image-container">
                                <img src={product.hoverImage} alt={`${product.name} - view 2`} />
                            </div>
                        )}
                    </div>

                    <div className="rating-section mt-4">
                        <h3>Rate & Review this product</h3>
                        <form onSubmit={handleSubmitRating}>
                            <div className="stars review-star-input">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="star-button"
                                        onClick={() => setRating(star)}
                                        aria-label={`${star} star rating`}
                                    >
                                        <FaStar
                                            size={24}
                                            color={star <= rating ? "#facc15" : "#d1d5db"}
                                        />
                                    </button>
                                ))}
                            </div>

                            <textarea
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="Write your review..."
                                className="form-control my-2"
                                rows="4"
                            />

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                                className="form-control my-2"
                            />

                            <button
                                type="submit"
                                className="btn-unique btn-primaryy mt-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <FaSpinner className="spinner" /> : "Submit Review"}
                            </button>
                        </form>

                        {message && <p className="review-message mt-2">{message}</p>}
                    </div>
                </div>

                <div className="product-info-unique">
                    <h1 className="product-title-unique">{product.name}</h1>

                    <div className="price-container-unique">
                        <span className="current-price">{formatPrice(product.selling_price)}</span>
                        <div className="original-price-wrapper">
                            <span className="original-price">{formatPrice(product.mrp)}</span>
                            {discount > 0 && (
                                <span className="discount-badgee">{discount}% OFF</span>
                            )}
                        </div>
                    </div>
                    <p className="taxes-info-unique">Inclusive of all taxes</p>

                    <div className="actions-container-unique">
                        <button
                            className="btn-unique btn-secondaryy"
                            onClick={handleAddToCart}
                            disabled={isAddingToCart || isBuyingNow}
                        >
                            {isAddingToCart ? <FaSpinner className="spinner" /> : <FaShoppingCart />}
                            Add to Cart
                        </button>
                        <button
                            className="btn-unique btn-primaryy"
                            onClick={handleBuyNow}
                            disabled={isAddingToCart || isBuyingNow}
                        >
                            {isBuyingNow ? <FaSpinner className="spinner" /> : <FaCreditCard />}
                            Buy Now
                        </button>
                        <button
                            className="btn-unique btn-secondaryy wishlist-action"
                            onClick={handleToggleWishlist}
                            disabled={isTogglingWishlist}
                        >
                            {isTogglingWishlist ? (
                                <FaSpinner className="spinner" />
                            ) : isProductWishlisted ? (
                                <FaHeart />
                            ) : (
                                <FaRegHeart />
                            )}
                            {isProductWishlisted ? "Wishlisted" : "Wishlist"}
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
                        <div className="detail-item">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>
                        <div className="detail-item">
                            <h3>Product Details</h3>
                            <ul>
                                <li><strong>Category:</strong> {product.category}</li>
                                <li><strong>Color:</strong> {product.color}</li>
                                <li><strong>Fabric:</strong> Georgette</li>
                            </ul>
                        </div>
                    </div>

                    <div className="delivery-info-unique">
                        Check Delivery Options for your Pincode
                    </div>
                </div>
            </div>

            <div className="existing-ratings mt-5">
                <h3 className="text-center mb-2">Customer Reviews</h3>
                <p className="text-center review-summary">
                    {ratings.totalRatings > 0
                        ? `${ratings.averageRating} out of 5 from ${ratings.totalRatings} review${ratings.totalRatings === 1 ? "" : "s"}`
                        : "No reviews yet. Be the first to review!"}
                </p>
                {ratings.ratings.length > 0 && (
                    <Slider {...reviewSliderSettings}>
                        {ratings.ratings.map((r, index) => (
                            <div key={r._id || index} className="review-slide-wrapper">
                                <div className="review-card border p-3 rounded mb-2">
                                    <div className="stars mb-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                size={18}
                                                color={star <= Number(r.userRating) ? "#facc15" : "#d1d5db"}
                                            />
                                        ))}
                                    </div>
                                    <p className="review-user">
                                        <strong>
                                            {r.userId?.fullName?.firstName || "Anonymous"}{" "}
                                            {r.userId?.fullName?.lastName || ""}
                                        </strong>
                                    </p>
                                    {r.userReview && <p className="review-text">{r.userReview}</p>}
                                    {r.productImage && (
                                        <img
                                            src={r.productImage}
                                            alt="Customer review"
                                            className="review-image"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </Slider>
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
        </div>
    );
};

export default ProductDetails;
