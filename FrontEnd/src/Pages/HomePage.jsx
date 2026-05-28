import { useEffect, useState } from "react"
import axios from "axios"
import ProductCard from "../Component/ProductCard"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";




const HomePage = () => {

    const [topBanner, setTopBanner] = useState([])
    const [trendingBanner, setTrendingBanner] = useState([])
    const [bestSellerBanner, setBestSellerBanner] = useState([])
    const [exclusiveCollectionBanner, setExclusiveCollectionBanner] = useState({})
    const [categoryImage, setCategoryImage] = useState([])
    const [product, setProduct] = useState([])
    const navigate = useNavigate();

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
        let products = await axios.get("http://localhost:4000/v1/product/getProduct")
        console.log(products.data.product);
        const allProduct = products?.data?.product
        setProduct(allProduct)
    }
    console.log("ppp", product);


    const fetchBanners = async () => {
        let banner = await axios.get("http://localhost:4000/v1/banner/getBanner")
        console.log(banner?.data?.banner.banners);
        const allCategoryImage = banner?.data?.banner?.categoryImages
        const allBanner = banner?.data?.banner?.banners
        setCategoryImage(allCategoryImage)
        setTopBanner(allBanner?.topBanner)
        setTrendingBanner(allBanner?.trendingBanner)
        setBestSellerBanner(allBanner?.bestSellerBanner)
        setExclusiveCollectionBanner(allBanner?.exclusiveCollectionBanner)

    }
    console.log(categoryImage);

    console.log(topBanner);
    console.log(trendingBanner);
    console.log(bestSellerBanner);
    console.log(exclusiveCollectionBanner);

    useEffect(() => {
        fetchBanners()
        fetchProducts()
    }, [])

    const handleCategoryClick = (category) => {
        navigate(`/collection?category=${encodeURIComponent(category)}`);
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

    return (
        <div>
            <section>
                <div className="topBanner">
                    <img src={topBanner} alt="" />
                </div>
            </section>
            <div className="slider">
                <div className="slide-track">
                    {loopIcons.map((icon, index) => (
                        <div className="slide" key={index}>
                            <img src={icon} style={{ width: "150px" }} alt={`icon-${index}`} />
                        </div>
                    ))}
                </div>
            </div>
            <section>
                <div className="categoryImage container-fluid ps-5 pe-5 mt-5">
                    <h2 className="text-center fw-bold mb-4">TOP CATEGORIES</h2>
                    <div className="row">
                        <div className="col-3" onClick={() => handleCategoryClick("Saree")} style={{ cursor: "pointer" }}>
                            <img src={categoryImage[0]} alt="Category 1" className="img-fluid" />
                        </div>
                        <div className="col-3" onClick={() => handleCategoryClick("Blouse")} style={{ cursor: "pointer" }}>
                            <img src={categoryImage[1]} alt="Category 2" className="img-fluid" />
                        </div>
                        <div className="col-3" onClick={() => handleCategoryClick("Shapewear")} style={{ cursor: "pointer" }} >
                            <img src={categoryImage[2]} alt="Category 3" className="img-fluid" />
                        </div>
                        <div className="col-3">
                            <img src={categoryImage[3]} alt="Category 4" className="img-fluid" />
                        </div>
                    </div>
                </div>

            </section>
            <section className="trending mt-5">
                <h2 className="text-center fw-bold mb-4">TRENDING NOW</h2>
                <div className="trendingBanner" onClick={() => handleCategoryClick("Saree")} style={{ cursor: "pointer" }}>
                    <img src={trendingBanner} alt="" className="img-fluid w-100" />
                </div>

                <div className="tredingProduct mt-4">
                    <Slider {...settings}>
                        {product
                            .filter((p) => p.subcategory === "Silk Saree")
                            .map((product, index) => (
                                <div key={index} className="px-3 d-flex justify-content-center">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                    </Slider>
                </div>
            </section>
            <section>
                <div className="bestSeller mt-5">
                    <h2 className="text-center mb-4 fw-bold">BESTSELLER SAREES</h2>
                    <div className="bestSellerBanner">
                        <img src={bestSellerBanner} alt="bestSellerBanner" />
                    </div>
                    <div className="tredingProduct mt-4">
                        <Slider {...settings}>
                            {product
                                .filter((p) => p.subcategory === "Georgette Saree")
                                .map((product, index) => (
                                    <div key={index} className="px-2 d-flex justify-content-center">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                        </Slider>
                    </div>
                </div>
            </section>
            <section>
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
            </section>
             <div className="slider">
                <div className="slide-track">
                    {loopMedia.map((icon, index) => (
                        <div className="slide" key={index}>
                            <img src={icon} style={{ width: "150px" }} alt={`icon-${index}`} />
                        </div>
                    ))}
                </div>
            </div>
            <section>
                <div className="exclusive mt-5">
                    <h2 className="text-center mb-4 fw-bold">EXCLUSIVE COLLECTION</h2>
                    <div className="exclusiveBanner">
                        <img src={exclusiveCollectionBanner} alt="" />
                    </div>
                    <div className="tredingProduct mt-4">
                        <Slider {...settings}>
                            {product
                                .filter((p) => p.subcategory === "Printed Saree")
                                .map((product, index) => (
                                    <div key={index} className="px-2 d-flex justify-content-center">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                        </Slider>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage