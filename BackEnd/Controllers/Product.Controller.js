const { productSchema, categorySchema } = require("../Models");
const { productService } = require("../Services");
const uploadImage = require("../Middleware/upload");
const fs = require("fs/promises");

const MAX_ADDITIONAL_IMAGES = 10;

const uploadProductFile = async (file) => {
    try {
        const cloud = await uploadImage(file.path);
        return cloud.secure_url || cloud.url;
    } finally {
        await fs.unlink(file.path).catch(() => {});
    }
};

const hasTooManyAdditionalImages = (images) => (
    Array.isArray(images) && images.length > MAX_ADDITIONAL_IMAGES
);

module.exports.uploadProductImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Please select an image to upload." });
        }

        const url = await uploadProductFile(req.file);
        res.status(201).json({ url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.addProduct = async (req, res) => {
    try {
        const body = { ...req.body };

        if (body.sizeDetails) {
            try {
                body.sizeDetails = JSON.parse(body.sizeDetails);
            } catch (e) {
                console.error("Error parsing sizeDetails:", e);
            }
        }

        // Process main image
        if (req.files && req.files['image'] && req.files['image'][0]) {
            body.image = await uploadProductFile(req.files['image'][0]);
        }

        // Process additional images
        if (req.files && req.files['images'] && req.files['images'].length > 0) {
            body.images = [];
            for (let i = 0; i < req.files['images'].length; i++) {
                body.images.push(await uploadProductFile(req.files['images'][i]));
            }
        }

        if (hasTooManyAdditionalImages(body.images)) {
            return res.status(400).json({ error: `You can upload up to ${MAX_ADDITIONAL_IMAGES} additional images.` });
        }

        const products = await productService.addProduct(body);

        // Push product to category document if it exists
        if (body.category) {
            // Find category by title or slug (case-insensitive)
            const cat = await categorySchema.findOne({ title: { $regex: new RegExp(`^${body.category}$`, 'i') } });
            if (cat) {
                // If products is an array or single product
                const productIds = Array.isArray(products) ? products.map(p => p._id) : [products._id];
                cat.products.push(...productIds);
                await cat.save();
            }
        }

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

        if (body.sizeDetails) {
            try {
                body.sizeDetails = JSON.parse(body.sizeDetails);
            } catch (e) {
                console.error("Error parsing sizeDetails:", e);
            }
        }

        // Process main image
        if (req.files && req.files['image'] && req.files['image'][0]) {
            body.image = await uploadProductFile(req.files['image'][0]);
        }

        // Parse existing images if any are kept
        if (body.existingImages) {
            body.images = JSON.parse(body.existingImages);
            delete body.existingImages;
        } else if (!Array.isArray(body.images)) {
            body.images = [];
        }

        // Process additional new images
        if (req.files && req.files['images'] && req.files['images'].length > 0) {
            for (let i = 0; i < req.files['images'].length; i++) {
                body.images.push(await uploadProductFile(req.files['images'][i]));
            }
        }

        if (hasTooManyAdditionalImages(body.images)) {
            return res.status(400).json({ error: `You can upload up to ${MAX_ADDITIONAL_IMAGES} additional images.` });
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
        
        // Remove from Category
        if (deletedProduct.category) {
            const cat = await categorySchema.findOne({ title: { $regex: new RegExp(`^${deletedProduct.category}$`, 'i') } });
            if (cat) {
                cat.products = cat.products.filter(pId => pId.toString() !== id);
                await cat.save();
            }
        }
        
        res.status(200).json({
            message: "Product deleted successfully",
            product: deletedProduct
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
