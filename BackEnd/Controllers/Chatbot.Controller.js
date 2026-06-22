const fs = require("fs/promises");
const { productSchema } = require("../Models");
const { callAtomesusChat } = require("../Services/Atomesus.Services");
const {
    buildRecommendations,
    buildStylistPrompt,
    getEligibleProducts,
    normalizeProductType,
} = require("../Services/StylistRecommendation.Services");

const parseJsonField = (value, fallback = {}) => {
    if (!value) return fallback;
    if (typeof value === "object") return value;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
};

const safeProductResponse = (product) => ({
    _id: product._id?.toString ? product._id.toString() : String(product._id || ""),
    name: product.name,
    image: product.image,
    slug: product.slug,
    mrp: product.mrp,
    selling_price: product.selling_price,
    category: product.category,
    subcategory: product.subcategory,
    color: product.color || product.blouseColor || product.bottomColor,
    productType: product.productType,
    blouseFabric: product.blouseFabric,
    blouseWork: product.blouseWork,
});

module.exports.getProductSuggestions = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a clothing photo." });
        }

        const productType = normalizeProductType(req.body.productType);
        const attributes = parseJsonField(req.body.attributes);
        const answers = parseJsonField(req.body.answers);

        const products = await productSchema.find({}).lean();
        const eligibleProducts = getEligibleProducts(products, productType).slice(0, 30);

        if (eligibleProducts.length === 0) {
            return res.status(404).json({
                message: "No matching products are available for this product type.",
                recommendations: [],
            });
        }

        const prompt = buildStylistPrompt({
            productType,
            attributes,
            answers,
            products: eligibleProducts,
        });

        let aiText = "";
        let aiStatus = "atomesus";
        let warning = null;

        try {
            aiText = await callAtomesusChat({ prompt });
        } catch (error) {
            aiStatus = "fallback";
            warning = error.message || "AI stylist is temporarily unavailable.";
        }

        const result = buildRecommendations({
            products: eligibleProducts,
            aiText,
            answers,
            productType,
        });

        return res.status(200).json({
            message: "Product suggestions generated successfully.",
            productType,
            aiStatus,
            usedFallback: result.usedFallback || aiStatus === "fallback",
            warning,
            recommendations: result.recommendations.map((item) => ({
                rank: item.rank,
                reason: item.reason,
                source: item.source,
                product: safeProductResponse(item.product),
            })),
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message || "Unable to generate product suggestions.",
        });
    } finally {
        if (req.file?.path) {
            await fs.unlink(req.file.path).catch(() => {});
        }
    }
};
