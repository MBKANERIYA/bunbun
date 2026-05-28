const { productSchema } = require("../Models");
const { productService } = require("../Services")

module.exports.addProduct = async (req, res) => {
    try {
        const body = req.body;
        const products = await productService.addProduct(body);

        res.status(201).json({
            message: "Product(s) added successfully",
            products
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports.getProduct = async (req, res) => {
    try {
        let product = await productService.getProduct()
        res.status(200).json({
            message: "get app product successfully",
            product
        })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

module.exports.filterProduct = async (req, res) => {
    try {
        let { category, subcategory, minPrice, maxPrice, colorBy } = req.body

        let filter = {}

        if (category) {
            filter.category = category
        }
        if (subcategory) {
            filter.subcategory = subcategory
        }
        if (minPrice || maxPrice) {
            filter.selling_price = {}
            if (minPrice) filter.selling_price.$gte = Number(minPrice)
            if (maxPrice) filter.selling_price.$lte = Number(maxPrice)
        }
        if (colorBy) {
            filter.color = colorBy;
        }

        const filterProduct = await productSchema.find(filter)

        res.status(200).json({
            message: "Get filter product successfully",
            length: filterProduct.length,
            filterProduct
        })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

module.exports.getSingleProduct = async (req, res) => {
    const { productId } = req.params

    let product = await productSchema.findById()
    if (product) {
        res.status(404).json({
            message: "Product not found"
        })
    }

    let singleProduct = await productService.singleProduct(productId)

    res.status(200).json({
        message: "product get successfully",
        singleProduct
    })
}