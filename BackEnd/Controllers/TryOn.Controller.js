const { productSchema } = require("../Models");
const { generateTryOnImage } = require("../Services/GeminiTryOn.Services");

/**
 * Generate a Try-On image
 * @route POST /v1/chatbot/try-on/generate
 */
const generateTryOn = async (req, res) => {
    try {
        const { selfieBase64, productId } = req.body;

        if (!selfieBase64) {
            return res.status(400).json({ message: "Please provide a selfie image (selfieBase64)." });
        }
        if (!productId) {
            return res.status(400).json({ message: "Please select a product to try on (productId)." });
        }

        // Fetch product from DB
        const product = await productSchema.findById(productId).lean();
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
        if (!product.image) {
            return res.status(400).json({ message: "This product does not have an image available for try-on." });
        }

        // Build product description for the prompt
        const descParts = [
            product.name,
            product.category,
            product.subcategory,
            product.color,
            product.blouseFabric,
            product.blouseWork
        ].filter(Boolean);
        const productDescription = descParts.join(", ");

        // Fetch product image and convert to base64
        let productImageBase64;
        try {
            const imgResponse = await fetch(product.image);
            if (!imgResponse.ok) {
                throw new Error(`Failed to fetch product image (Status: ${imgResponse.status})`);
            }
            const buffer = await imgResponse.arrayBuffer();
            productImageBase64 = Buffer.from(buffer).toString('base64');
        } catch (imgError) {
            console.error("Error fetching product image:", imgError);
            return res.status(500).json({ message: "Failed to download the product image for try-on processing." });
        }

        // Generate Try-On Image
        const result = await generateTryOnImage({
            userImageBase64: selfieBase64,
            productImageBase64,
            productDescription
        });

        res.status(200).json({
            success: true,
            image: {
                base64: result.imageBase64,
                mimeType: result.mimeType
            },
            product: {
                _id: product._id,
                name: product.name,
                image: product.image,
                slug: product.slug,
                selling_price: product.selling_price
            },
            message: result.textResponse
        });

    } catch (error) {
        console.error("Generate Try-On Error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "An unexpected error occurred while generating the try-on image." 
        });
    }
};

/**
 * Get products suitable for try-on, with pagination and filtering
 * @route GET /v1/chatbot/try-on/products
 */
const getTryOnProducts = async (req, res) => {
    try {
        const { search, productType, page = 1, limit = 12 } = req.query;
        
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 12;
        const skip = (pageNum - 1) * limitNum;

        const query = {};

        // Apply filters
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        if (productType) {
            if (productType === "plain_blouse") {
                query.category = { $regex: "blouse", $options: "i" };
                query.subcategory = { $regex: "plain", $options: "i" };
            } else if (productType === "kalamkari_blouse") {
                query.category = { $regex: "blouse", $options: "i" };
                query.$or = [
                    { subcategory: { $regex: "printed|kalamkari", $options: "i" } },
                    { blouseWork: { $regex: "kalamkari", $options: "i" } },
                    { productType: { $regex: "kalamkari", $options: "i" } },
                    { name: { $regex: "kalamkari", $options: "i" } }
                ];
            } else if (productType === "shapewear") {
                query.category = { $regex: "shapewear", $options: "i" };
            }
            // If unknown productType, we don't filter by it, just let them see all
        }

        const total = await productSchema.countDocuments(query);
        const products = await productSchema.find(query)
            .select("_id name image slug selling_price category subcategory color")
            .sort({ name: 1 })
            .skip(skip)
            .limit(limitNum)
            .lean();

        res.status(200).json({
            success: true,
            products,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
            total
        });

    } catch (error) {
        console.error("Get Try-On Products Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch products for try-on." 
        });
    }
};

module.exports = {
    generateTryOn,
    getTryOnProducts
};
