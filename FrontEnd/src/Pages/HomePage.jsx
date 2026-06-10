import { useEffect, useState } from "react"
import PageMeta from "../Component/PageMeta"
import axios from "axios"
import ProductCard from "../Component/ProductCard"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { apiUrl } from "../utils/apiConfig";
import { FaStar } from "react-icons/fa";




const HomePage = () => {

    const [topBanner, setTopBanner] = useState([])
    const [trendingBanner, setTrendingBanner] = useState([])
    const [bestSellerBanner, setBestSellerBanner] = useState([])
    const [exclusiveCollectionBanner, setExclusiveCollectionBanner] = useState({})
    const [categoryImage, setCategoryImage] = useState([])
    const [product, setProduct] = useState([])
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [isMobileView, setIsMobileView] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobileView(window.innerWidth < 768);
        handleResize(); // Initial check
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const icons = [
        "https://sudathi.com/cdn/shop/files/6_b35ea9ed-5ea0-459f-9371-391249f6e4d0.png?height=160&v=1744868662",
        "https://sudathi.com/cdn/shop/files/1_83ec00a7-fff2-49e0-820a-378ab3087e75.png?height=160&v=1744868747",
        "https://sudathi.com/cdn/shop/files/4_95600bae-e0c1-464e-a79f-bed293329e0e.png?height=160&v=1744868680",
        "https://sudathi.com/cdn/shop/files/6_b35ea9ed-5ea0-459f-9371-391249f6e4d0.png?height=160&v=1744868662",
        "https://sudathi.com/cdn/shop/files/1_83ec00a7-fff2-49e0-820a-378ab3087e75.png?height=160&v=1744868747",
        "https://sudathi.com/cdn/shop/files/4_95600bae-e0c1-464e-a79f-bed293329e0e.png?height=160&v=1744868680",
        "https://sudathi.com/cdn/shop/files/6_b35ea9ed-5ea0-459f-9371-391249f6e4d0.png?height=160&v=1744868662",
        "https://sudathi.com/cdn/shop/files/1_83ec00a7-fff2-49e0-820a-378ab3087e75.png?height=160&v=1744868747",
        "https://sudathi.com/cdn/shop/files/4_95600bae-e0c1-464e-a79f-bed293329e0e.png?height=160&v=1744868680",
        "https://sudathi.com/cdn/shop/files/6_b35ea9ed-5ea0-459f-9371-391249f6e4d0.png?height=160&v=1744868662",
        "https://sudathi.com/cdn/shop/files/1_83ec00a7-fff2-49e0-820a-378ab3087e75.png?height=160&v=1744868747",
        "https://sudathi.com/cdn/shop/files/4_95600bae-e0c1-464e-a79f-bed293329e0e.png?height=160&v=1744868680",
        "https://sudathi.com/cdn/shop/files/6_b35ea9ed-5ea0-459f-9371-391249f6e4d0.png?height=160&v=1744868662",
        "https://sudathi.com/cdn/shop/files/1_83ec00a7-fff2-49e0-820a-378ab3087e75.png?height=160&v=1744868747",
        "https://sudathi.com/cdn/shop/files/4_95600bae-e0c1-464e-a79f-bed293329e0e.png?height=160&v=1744868680",

    ];

    const medias = [
        "https://sudathi.com/cdn/shop/files/Untitled_design_1_19ffc087-2920-4f74-a7a8-181808225b51.png?height=160&v=1755167964",
        "https://sudathi.com/cdn/shop/files/Untitled_design-compressed_1.jpg?height=160&v=1755168014",
        "https://sudathi.com/cdn/shop/files/2_8f00feeb-51f0-40d3-aa0c-538d91e6f2cc.png?height=160&v=1754396592",
        "https://sudathi.com/cdn/shop/files/Untitled_design_6_83977049-b329-49cf-8c8d-fc81b8509b1a.png?height=160&v=1755169151",
        "https://sudathi.com/cdn/shop/files/Untitled_design_4_-compressed_308a28de-2996-44eb-8278-9552ea5d24ff.jpg?height=160&v=1755168477",
        "https://sudathi.com/cdn/shop/files/Untitled_design_1_19ffc087-2920-4f74-a7a8-181808225b51.png?height=160&v=1755167964",
        "https://sudathi.com/cdn/shop/files/Untitled_design-compressed_1.jpg?height=160&v=1755168014",
        "https://sudathi.com/cdn/shop/files/2_8f00feeb-51f0-40d3-aa0c-538d91e6f2cc.png?height=160&v=1754396592",
        "https://sudathi.com/cdn/shop/files/Untitled_design_6_83977049-b329-49cf-8c8d-fc81b8509b1a.png?height=160&v=1755169151",
        "https://sudathi.com/cdn/shop/files/Untitled_design_4_-compressed_308a28de-2996-44eb-8278-9552ea5d24ff.jpg?height=160&v=1755168477",
        "https://sudathi.com/cdn/shop/files/Untitled_design_1_19ffc087-2920-4f74-a7a8-181808225b51.png?height=160&v=1755167964",
        "https://sudathi.com/cdn/shop/files/Untitled_design-compressed_1.jpg?height=160&v=1755168014",
        "https://sudathi.com/cdn/shop/files/2_8f00feeb-51f0-40d3-aa0c-538d91e6f2cc.png?height=160&v=1754396592",
        "https://sudathi.com/cdn/shop/files/Untitled_design_6_83977049-b329-49cf-8c8d-fc81b8509b1a.png?height=160&v=1755169151",
        "https://sudathi.com/cdn/shop/files/Untitled_design_4_-compressed_308a28de-2996-44eb-8278-9552ea5d24ff.jpg?height=160&v=1755168477",
    ]
    const loopIcons = [...icons, ...icons];

    const loopMedia = [...medias, ...medias]

    const fetchProducts = async () => {
        try {
            let products = await axios.get(apiUrl("/v1/product/getProduct"))
            console.log(products?.data?.product);
            const allProduct = products?.data?.product || []
            setProduct(allProduct)
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setProduct([]);
        }
    }
    console.log("ppp", product);


    const fetchBanners = async () => {
        try {
            let banner = await axios.get(apiUrl("/v1/banner/getBanner"))
            console.log(banner?.data?.banner?.banners);
            const allCategoryImage = banner?.data?.banner?.categoryImages || []
            const allBanner = banner?.data?.banner?.banners || {}
            setCategoryImage(allCategoryImage)
            setTopBanner(allBanner?.topBanner)
            setTrendingBanner(allBanner?.trendingBanner)
            setBestSellerBanner(allBanner?.bestSellerBanner)
            setExclusiveCollectionBanner(allBanner?.exclusiveCollectionBanner)
        } catch (error) {
            console.error("Failed to fetch banners:", error);
        }
    }
    console.log(categoryImage);

    console.log(topBanner);
    console.log(trendingBanner);
    console.log(bestSellerBanner);
    console.log(exclusiveCollectionBanner);

    const sampleReviews = [
        { _id: 's1', userName: 'Priya Sharma', userRating: 5, userReview: 'Absolutely love the quality! The blouse fits perfectly and the fabric is so soft. Will definitely buy again.', productName: 'Designer Blouse' },
        { _id: 's2', userName: 'Anjali Patel', userRating: 5, userReview: 'Best shapewear I have ever purchased. Very comfortable for daily wear and the stitching is flawless.', productName: 'Premium Shapewear' },
        { _id: 's3', userName: 'Meera Joshi', userRating: 4, userReview: 'Beautiful design and fast delivery. The color was exactly as shown in the pictures. Highly recommended!', productName: 'Silk Saree' },
        { _id: 's4', userName: 'Kavita Reddy', userRating: 5, userReview: 'Amazing collection and great customer service. The packaging was premium and the product exceeded my expectations.', productName: 'Bridal Blouse' },
        { _id: 's5', userName: 'Sneha Gupta', userRating: 4, userReview: 'Wonderful experience shopping here. The material quality is top-notch and very reasonably priced for what you get.', productName: 'Cotton Blouse' },
        { _id: 's6', userName: 'Ritu Agarwal', userRating: 5, userReview: 'I received so many compliments wearing this! The craftsmanship is exceptional. Bunbun never disappoints.', productName: 'Party Wear Blouse' },
    ];

    const fetchReviews = async () => {
        try {
            const response = await axios.get(apiUrl("/v1/rating/getAllReviews"));
            const fetchedReviews = response.data?.reviews || [];
            setReviews(fetchedReviews.length > 0 ? fetchedReviews : sampleReviews);
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
            setReviews(sampleReviews);
        }
    }

    useEffect(() => {
        fetchBanners()
        fetchProducts()
        fetchReviews()
        const viewedItems = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
        setRecentlyViewed(viewedItems);
    }, [])

    const reviewSliderSettings = {
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    const handleCategoryClick = (category) => {
        navigate(`/collections?category=${encodeURIComponent(category)}`);
    };

    const settings = {
        infinite: false,
        speed: 500,
        slidesToShow: 4.5,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2.3,
                },
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1.3,
                },
            },
        ],
    };

    const videoSliderSettings = {
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
    };

    const videoIds = [
        "S7MwBlM3HpU",
        "NiRjMVy-Tdk",
        "JXFPwReAGN4",
        "BEJ9-sMNnNQ",
        "S7MwBlM3HpU"
    ];

    return (
        <div>
            <PageMeta title="Shop Indian Sarees, Blouses & Shapewear Online" description="Bunbun Clothing - Premium Indian ethnic wear. Shop the latest sarees, blouses, shapewear and more with free shipping." />
            <section>
                <div className="topBanner">
                    <Carousel
                        showThumbs={false}
                        showStatus={false}
                        infiniteLoop
                        autoPlay
                        interval={4000}
                        stopOnHover={false}
                    >
                        <div>
                            <picture>
                                <source media="(max-width: 768px)" srcSet="https://res.cloudinary.com/dacwlu4mo/image/upload/v1780655158/sfvc_1_yae3sr.png" />
                                <img src="https://res.cloudinary.com/dacwlu4mo/image/upload/v1780463096/bunbun_banner_1_fdn2hr.png" alt="Home Hero Banner" className="img-fluid w-100" />
                            </picture>
                        </div>
                        <div>
                            <picture>
                                <source media="(max-width: 768px)" srcSet="https://res.cloudinary.com/dacwlu4mo/image/upload/v1780657437/jfyg_vqmwqn.png" />
                                <img src="https://res.cloudinary.com/dacwlu4mo/image/upload/v1780655163/jfythg_owjoqg.png" alt="Home Hero Banner 2" className="img-fluid w-100" />
                            </picture>
                        </div>
                    </Carousel>
                </div>
            </section>
            <div className="icon-slider">
                <div className="icon-slide-track">
                    {loopIcons.map((icon, index) => (
                        <div className="icon-slide" key={index}>
                            <img src={icon} alt={`icon-${index}`} />
                        </div>
                    ))}
                </div>
            </div>
            <section>
                <div className="categoryImage container-fluid ps-5 pe-5 mt-5">
                    <h2 className="text-center fw-bold mb-4">TOP CATEGORIES</h2>
                    <div className="row">

                        <div className="col-3" onClick={() => navigate(`/collections?category=${encodeURIComponent("Blouse")}&subcategory=${encodeURIComponent("Plain")}`)} style={{ cursor: "pointer" }}>
                            <div className="category-card-wrapper">
                                <img src="https://res.cloudinary.com/drizf8zcc/image/upload/v1780996653/products/xkluigbdizxxvg9vyxbt.jpg" alt="Plain Blouses" className="img-fluid" style={{ aspectRatio: "4/5", objectFit: "cover" }} />
                            </div>
                            <p className="category-label">PLAIN BLOUSE <span>⟶</span></p>
                        </div>
                        <div className="col-3" onClick={() => navigate(`/collections?category=${encodeURIComponent("Blouse")}&subcategory=${encodeURIComponent("Printed")}`)} style={{ cursor: "pointer" }}>
                            <div className="category-card-wrapper">
                                <img src="https://res.cloudinary.com/drizf8zcc/image/upload/v1780997353/products/ecfsxo1aa430vykeiikp.jpg" alt="Kalamkari Blouses" className="img-fluid" style={{ aspectRatio: "4/5", objectFit: "cover" }} />
                            </div>
                            <p className="category-label">KALAMKARI BLOUSE <span>⟶</span></p>
                        </div>
                        <div className="col-3" onClick={() => handleCategoryClick("Shapewear")} style={{ cursor: "pointer" }} >
                            <div className="category-card-wrapper">
                                <img src="https://res.cloudinary.com/drizf8zcc/image/upload/v1780898529/products/x0zvztaapyzicsuulp4w.jpg" alt="Shapewears" className="img-fluid" style={{ aspectRatio: "4/5", objectFit: "cover" }} />
                            </div>
                            <p className="category-label">SHAPEWEAR <span>⟶</span></p>
                        </div>
                        <div className="col-3 category-coming-soon">
                            <div className="category-card-wrapper">
                                <img src="https://res.cloudinary.com/dacwlu4mo/image/upload/v1781003332/ChatGPT_Image_Jun_9_2026_04_37_35_PM_ab96pt.png" alt="Kurti" className="img-fluid" style={{ aspectRatio: "4/5", objectFit: "cover" }} />
                                <div className="category-overlay">
                                    <p className="coming-soon-text">Coming Soon</p>
                                </div>
                            </div>
                            <p className="category-label">KURTI SET <span>⟶</span></p>
                        </div>
                    </div>
                </div>

            </section>
            <section className="trending mt-5">
                <h2 className="text-center fw-bold mb-4">PLAIN BLOUSES COLLECTION</h2>
                <div className="trendingBanner" onClick={() => handleCategoryClick("Saree")} style={{ cursor: "pointer" }}>
                    <picture>
                        <source media="(max-width: 768px)" srcSet="https://res.cloudinary.com/dacwlu4mo/image/upload/v1780897492/blouse_web_banner_vpx0tq.png" />
                        <img src="https://res.cloudinary.com/dacwlu4mo/image/upload/v1780897480/banner_pc_blouse_jezecv.png" alt="Trending Now Banner" className="img-fluid w-100" loading="lazy" />
                    </picture>
                </div>

                <div className="tredingProduct mt-4">
                    <Slider {...settings}>
                        {(product || [])
                            .filter((p) => p.category === "Blouse" && p.subcategory === "Plain")
                            .map((product, index) => (
                                <div key={index} className="px-2">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                    </Slider>
                </div>
            </section>

            <section>
                <div className="bestSeller mt-5">
                    <h2 className="text-center mb-4 fw-bold">KALAMKARI BLOUSES COLLECTION</h2>
                    <div className="bestSellerBanner">
                        <picture>
                            <source media="(max-width: 768px)" srcSet="https://res.cloudinary.com/dacwlu4mo/image/upload/v1780996760/SCX_iejspv.png" />
                            <img src="https://res.cloudinary.com/dacwlu4mo/image/upload/v1780996756/printed_blouse_cy720u.png" alt="Bestseller Sarees Banner" loading="lazy" />
                        </picture>
                    </div>
                    <div className="tredingProduct mt-4">
                        <Slider {...settings}>
                            {(product || [])
                                .filter((p) => p.category === "Blouse" && p.subcategory === "Printed")
                                .map((product, index) => (
                                    <div key={index} className="px-2">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                        </Slider>
                    </div>
                </div>
            </section>

            <section>
                <div className="bestSeller mt-5">
                    <h2 className="text-center mb-4 fw-bold">SHAPEWEAR COLLECTION</h2>
                    <div className="bestSellerBanner">
                        <picture>
                            <source media="(max-width: 768px)" srcSet="https://res.cloudinary.com/dacwlu4mo/image/upload/v1780897490/shapewearbm_gv9cm9.png" />
                            <img src="https://res.cloudinary.com/dacwlu4mo/image/upload/v1780897479/SHAPWEAR_BANNER_vs1yeh.png" alt="Bestseller Sarees Banner" loading="lazy" />
                        </picture>
                    </div>
                    <div className="tredingProduct mt-4">
                        <Slider {...settings}>
                            {(product || [])
                                .filter((p) => p.category === "Shapewear")
                                .map((product, index) => (
                                    <div key={index} className="px-2">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                        </Slider>
                    </div>
                </div>
            </section>
            {/* <section>
                <div className="sareeStore container-fluid pe-5 ps-5 mt-5">
                    <h2 className="text-center fw-bold mb-4">THE SAREE STORE</h2>
                    <div className="sareeStoreImages">
                        <div className="row justify-content-between">

                            <div className="gold">
                                <img src={categoryImage[4]} alt="" />
                            </div>

                            <div className="middle ps-4 pe-4">
                                <div className="bestSellet pb-2">
                                    <img src={categoryImage[5]} alt="" />
                                </div>
                                <div className="essentials">
                                    <img src={categoryImage[6]} alt="" />
                                </div>
                            </div>

                            <div className="readyToWear">
                                <img src={categoryImage[7]} alt="" />
                            </div>

                        </div>
                    </div>
                </div>
            </section> */}

            {/* Customer Reviews Section */}
            {reviews.length > 0 && (
                <section className="customer-reviews mt-5 container-fluid pe-5 ps-5">
                    <h2 className="text-center fw-bold mb-4">WHAT OUR CUSTOMERS SAY</h2>
                    <div className="reviews-slider">
                        <Slider {...reviewSliderSettings}>
                            {reviews.map((review, index) => (
                                <div key={review._id || index} className="px-3">
                                    <div className="review-card">
                                        <div className="review-card-header">
                                            <div className="review-avatar">
                                                {review.userName?.charAt(0)?.toUpperCase() || 'C'}
                                            </div>
                                            <div className="review-user-info">
                                                <h6 className="review-user-name">{review.userName}</h6>
                                                <div className="review-stars">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar
                                                            key={i}
                                                            className={i < review.userRating ? 'star-filled' : 'star-empty'}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="review-text">"{review.userReview}"</p>
                                        {review.productName && (
                                            <p className="review-product-name">— {review.productName}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </section>
            )}

            <div className="icon-slider">
                <div className="icon-slide-track">
                    {loopMedia.map((icon, index) => (
                        <div className="icon-slide" key={index}>
                            <img src={icon} alt={`icon-${index}`} />
                        </div>
                    ))}
                </div>
            </div>
            <section className="featured-shorts mt-5 container-fluid pe-5 ps-5">
                <h2 className="text-center fw-bold mb-4">FEATURED PRODUCTS</h2>
                {isMobileView ? (
                    <div className="video-slider-container">
                        <Slider {...videoSliderSettings}>
                            {videoIds.map((id, index) => (
                                <div key={index} className="px-2">
                                    <div className="short-video-card">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${id}&playsinline=1`}
                                            title={`YouTube video player ${index + 1}`}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                            className="w-100"
                                            style={{ aspectRatio: "9/16" }}
                                            loading="lazy"
                                        ></iframe>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                ) : (
                    <div className="row row-cols-2 row-cols-md-5 g-4 justify-content-center">
                        {videoIds.map((id, index) => (
                            <div className="col" key={index}>
                                <div className="short-video-card">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${id}&playsinline=1`}
                                        title={`YouTube video player ${index + 1}`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        className="w-100"
                                        style={{ aspectRatio: "9/16" }}
                                        loading="lazy"
                                    ></iframe>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>


            {recentlyViewed.length > 0 && (
                <section className="recently-viewed mt-5 mb-5">
                    <h2 className="text-center fw-bold mb-4">RECENTLY VIEWED</h2>
                    <div className="tredingProduct mt-4">
                        <Slider {...settings}>
                            {recentlyViewed.map((product, index) => (
                                <div key={index} className="px-2">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </section>
            )}
        </div>
    )
}

export default HomePage
