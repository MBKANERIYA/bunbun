const { productSchema } = require("../Models");
const { productService } = require("../Services");
const uploadImage = require("../Middleware/upload");

module.exports.addProduct = async (req, res) => {
    try {
        const body = { ...req.body };

        // Process main image
        if (req.files && req.files['image'] && req.files['image'][0]) {
            const { path, originalname } = req.files['image'][0];
            const cloud = await uploadImage(path, originalname);
            body.image = cloud.url;
        }

        // Process additional images
        if (req.files && req.files['images'] && req.files['images'].length > 0) {
            body.images = [];
            for (let i = 0; i < req.files['images'].length; i++) {
                const { path, originalname } = req.files['images'][i];
                const cloud = await uploadImage(path, originalname);
                body.images.push(cloud.url);
            }
        }

        const products = await productService.addProduct(body);

        res.status(201).json({
            message: "Product(s) added successfully",
            products
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const body = { ...req.body };

        // Process main image
        if (req.files && req.files['image'] && req.files['image'][0]) {
            const { path, originalname } = req.files['image'][0];
            const cloud = await uploadImage(path, originalname);
            body.image = cloud.url;
        }

        // Parse existing images if any are kept
        if (body.existingImages) {
            body.images = JSON.parse(body.existingImages);
            delete body.existingImages;
        } else {
            body.images = [];
        }

        // Process additional new images
        if (req.files && req.files['images'] && req.files['images'].length > 0) {
            for (let i = 0; i < req.files['images'].length; i++) {
                const { path, originalname } = req.files['images'][i];
                const cloud = await uploadImage(path, originalname);
                body.images.push(cloud.url);
            }
        }

        const updatedProduct = await productService.updateProduct(id, body);

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
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
            filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }
        if (subcategory) {
            filter.subcategory = { $regex: new RegExp(`^${subcategory}$`, 'i') };
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

    let singleProduct = await productService.singleProduct(productId);
    if (!singleProduct) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.status(200).json({
        message: "product get successfully",
        singleProduct
    })
}

module.exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await productService.deleteProduct(id);
        
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.status(200).json({
            message: "Product deleted successfully",
            product: deletedProduct
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};