import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import ProductCard from '../Component/ProductCard'
import { apiUrl } from '../utils/apiConfig'

let category = [
    "https://sudathi.com/cdn/shop/files/7-compressed_29cbce78-d541-409d-803a-7d0d1863599e.jpg?v=1736233279&width=750",
    "https://sudathi.com/cdn/shop/files/8-compressed_795ef07d-948a-4aee-bc0f-182ba82405aa.jpg?v=1736233279&width=750",
    "https://sudathi.com/cdn/shop/files/8-compressed_795ef07d-948a-4aee-bc0f-182ba82405aa.jpg?v=1736233279&width=750",
    "https://sudathi.com/cdn/shop/files/10-compressed_3dbc61e0-395b-4b40-a4fc-c01c33ddaaf0.jpg?v=1736233279&width=750"
]
const NadhaagaGold = () => {

    const [product, setProduct] = useState([])

    const fetchProducts = async () => {
        let products = await axios.get(apiUrl("/v1/product/getProduct"))
        console.log(products.data.product);
        const allProduct = products?.data?.product
        setProduct(allProduct)
    }
    console.log("ppp", product);

    useEffect(() => {
        fetchProducts()
    }, [])

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
        <div className="row">
            <div className="col-12 container-ffluid">
                <img src="https://sudathi.com/cdn/shop/files/Sudathi-Gold---Desktop-banner-1.jpg?v=1757750309&width=3840" alt="" style={{ objectFit: "cover",width :"100%" }} />
            </div>
            <div className="col-12">
                <img src="https://sudathi.com/cdn/shop/files/1_9d26d9ce-16a4-480c-8eb9-280e97f6121b.jpg?v=1736167486&width=3840" style={{ objectFit: "cover", width : "100%" }} alt="" />
            </div>

            <div className="tredingProduct mt-4">
                <Slider {...settings}>
                    {product
                        .filter((p) => p.tag === "most loved")
                        .map((product, index) => (
                            <div key={index} className="px-3 d-flex justify-content-center">
                                <ProductCard product={product} />
                            </div>
                        ))}
                </Slider>
            </div>
            <div className="col-12">
                <img src="https://sudathi.com/cdn/shop/files/2_99950b15-a648-472b-98b5-ec8b01f8bbc4.jpg?v=1736169420&width=3840" style={{ objectFit: "cover", width : "100%" }} alt="" />
            </div>
            <div className="col-12">
                <img src="https://sudathi.com/cdn/shop/files/Banner-3-1-compressed_1.jpg?v=1736312299&width=3840" style={{ objectFit: "cover", width : "100%" }} alt="" />
            </div>
            <Slider {...settings}>
                {product
                    .filter((p) => p.tag === "new arrival")
                    .map((product, index) => (
                        <div key={index} className="px-3 d-flex justify-content-center">
                            <ProductCard product={product} />
                        </div>
                    ))}
            </Slider>
            <div className="col-12">
                <img src="https://sudathi.com/cdn/shop/files/3_17bad4d0-615b-4520-8c27-ebc21812de5f.jpg?v=1736230131&width=3840" style={{ objectFit: "cover", width : "100%" }} alt="" />

            </div>
            <div className="col-12">
                <img src="https://sudathi.com/cdn/shop/files/Banner-3-1-compressed_1.jpg?v=1736312299&width=3840" style={{ objectFit: "cover", width : "100%" }} alt="" />
            </div>
            <Slider {...settings}>
                {category.map((image, index) => (
                    <div key={index} className="px-3 d-flex justify-content-center">
                        <img
                            src={image}
                            alt={`Category ${index}`}
                            // className="rounded-3"
                            style={{ width : "100%", height : "auto", objectFit: "cover" }}
                        />
                    </div>
                ))}
            </Slider>
            <div className="col-12">
                <img src="https://sudathi.com/cdn/shop/files/4_faae7f4d-695e-463f-9dd0-b69fc865af61.jpg?v=1736233485&width=3840" style={{ objectFit: "cover", width : "100%" }} alt="" />
            </div>
            <Slider {...settings}>
                {product
                    .filter((p) => p.tag === "best seller")
                    .map((product, index) => (
                        <div key={index} className="px-3 d-flex justify-content-center">
                            <ProductCard product={product} />
                        </div>
                    ))}
            </Slider>
        </div>
    )
}

export default NadhaagaGold
