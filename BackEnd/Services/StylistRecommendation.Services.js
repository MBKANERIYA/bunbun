const PRODUCT_TYPE_LABELS = {
    plain_blouse: "Plain Blouse",
    kalamkari_blouse: "Kalamkari Blouse",
    shapewear: "Shapewear",
};

const normalizeText = (value) => String(value || "").trim().toLowerCase();

const getProductId = (product) => (
    product?._id?.toString ? product._id.toString() : String(product?._id || "")
);

const normalizeProductType = (value) => {
    const normalized = normalizeText(value).replace(/[\s-]+/g, "_");
    const aliases = {
        plain: "plain_blouse",
        plain_blouse: "plain_blouse",
        blouse_plain: "plain_blouse",
        kalamkari: "kalamkari_blouse",
        kalamkari_blouse: "kalamkari_blouse",
        printed_blouse: "kalamkari_blouse",
        shapewear: "shapewear",
        shape_wear: "shapewear",
    };

    const productType = aliases[normalized];
    if (!productType) {
        throw new Error("Unsupported product type");
    }
    return productType;
};

const isEligibleProduct = (product, productType) => {
    const type = normalizeProductType(productType);
    const category = normalizeText(product.category);
    const subcategory = normalizeText(product.subcategory);
    const name = normalizeText(product.name);
    const work = normalizeText(product.blouseWork);
    const productTypeField = normalizeText(product.productType);

    if (type === "plain_blouse") {
        return category === "blouse" && subcategory === "plain";
    }

    if (type === "kalamkari_blouse") {
        return category === "blouse" && (
            subcategory.includes("printed") ||
            subcategory.includes("kalamkari") ||
            work.includes("kalamkari") ||
            productTypeField.includes("kalamkari") ||
            name.includes("kalamkari")
        );
    }

    if (type === "shapewear") {
        return category === "shapewear";
    }

    return false;
};

const getEligibleProducts = (products, productType) => (
    products.filter((product) => isEligibleProduct(product, productType))
);

const normalizeProductIdList = (value) => {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => String(item || "").trim())
        .filter(Boolean);
};

const getAlreadyShownProductIds = (attributes = {}) => new Set([
    ...normalizeProductIdList(attributes.shownProductIds),
    ...normalizeProductIdList(attributes.excludeProductIds),
]);

const filterAlreadyShownProducts = (products, attributes = {}) => {
    const alreadyShownIds = getAlreadyShownProductIds(attributes);
    if (alreadyShownIds.size === 0) return products;
    return products.filter((product) => !alreadyShownIds.has(getProductId(product)));
};

const compactCatalogCandidate = (product) => ({
    id: getProductId(product),
    name: product.name || "",
    category: product.category || "",
    subcategory: product.subcategory || "",
    color: product.color || product.blouseColor || product.bottomColor || "",
    price: product.selling_price || "",
    fabric: product.blouseFabric || product.bottomFabric || "",
    work: product.blouseWork || product.bottomWork || "",
});

const extractJsonObject = (text) => {
    const raw = String(text || "").trim();
    if (!raw) return null;

    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const candidate = fenced ? fenced[1].trim() : raw;
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start === -1 || end === -1 || end < start) return null;

    try {
        return JSON.parse(candidate.slice(start, end + 1));
    } catch {
        return null;
    }
};

const fallbackReason = (product, answers = {}, productType = "") => {
    const label = PRODUCT_TYPE_LABELS[normalizeProductType(productType)] || "product";
    const color = product.color || product.blouseColor || product.bottomColor;
    const occasion = answers.occasion || answers.desiredLook;
    const colorPart = color ? `${color} ` : "";
    const occasionPart = occasion ? ` for ${occasion}` : "";
    return `${colorPart}${label} selected from the matching catalog${occasionPart}.`;
};

const buildFallbackRecommendations = ({ products, answers, productType, excludeIds = new Set(), needed = 5 }) => {
    return products
        .filter((product) => !excludeIds.has(getProductId(product)))
        .slice(0, needed)
        .map((product) => ({
            product,
            reason: fallbackReason(product, answers, productType),
            source: "fallback",
        }));
};

const buildRecommendations = ({ products, aiText, answers = {}, productType }) => {
    const productById = new Map(products.map((product) => [getProductId(product), product]));
    const parsed = extractJsonObject(aiText);
    const rawRecommendations = Array.isArray(parsed?.recommendations) ? parsed.recommendations : [];
    const seen = new Set();
    const recommendations = [];
    let discardedAiItem = false;

    rawRecommendations.forEach((item) => {
        const productId = String(item.productId || item.id || "").trim();
        if (!productById.has(productId) || seen.has(productId)) {
            discardedAiItem = true;
            return;
        }

        seen.add(productId);
        recommendations.push({
            product: productById.get(productId),
            reason: String(item.reason || "").trim() || fallbackReason(productById.get(productId), answers, productType),
            source: "atomesus",
        });
    });

    if (recommendations.length < 5) {
        const fallback = buildFallbackRecommendations({
            products,
            answers,
            productType,
            excludeIds: seen,
            needed: 5 - recommendations.length,
        });
        fallback.forEach((item) => {
            seen.add(getProductId(item.product));
            recommendations.push(item);
        });
    }

    return {
        recommendations: recommendations.slice(0, 5).map((item, index) => ({
            ...item,
            rank: index + 1,
        })),
        usedFallback: discardedAiItem || recommendations.length < 5 || rawRecommendations.length < 5,
    };
};

const buildStylistPrompt = ({ productType, attributes = {}, answers = {}, products = [] }) => {
    const label = PRODUCT_TYPE_LABELS[normalizeProductType(productType)];
    const candidates = products.map(compactCatalogCandidate);

    return [
        "You are a practical Indian ethnicwear stylist for Bunbun Clothing.",
        "Recommend products only from the provided catalog candidate IDs.",
        `The customer is shopping for: ${label}.`,
        `Confirmed clothing/photo attributes: ${JSON.stringify(attributes)}.`,
        `Customer answers: ${JSON.stringify(answers)}.`,
        `Catalog candidates: ${JSON.stringify(candidates)}.`,
        "Return valid JSON only in this exact shape:",
        '{"recommendations":[{"productId":"catalog id","reason":"short styling reason"}]}',
        "Return exactly 5 recommendations when at least 5 candidates exist. Do not invent product IDs.",
    ].join("\n");
};

module.exports = {
    buildRecommendations,
    buildStylistPrompt,
    compactCatalogCandidate,
    filterAlreadyShownProducts,
    getEligibleProducts,
    getProductId,
    isEligibleProduct,
    normalizeProductType,
};
