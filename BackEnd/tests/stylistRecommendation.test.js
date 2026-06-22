const assert = require("node:assert/strict");
const test = require("node:test");

const {
    buildRecommendations,
    filterAlreadyShownProducts,
    getEligibleProducts,
    normalizeProductType,
} = require("../Services/StylistRecommendation.Services");

const products = [
    { _id: "p1", name: "Ruby Plain Blouse", category: "Blouse", subcategory: "Plain", color: "Red", selling_price: "349" },
    { _id: "p2", name: "Gold Plain Blouse", category: "Blouse", subcategory: "Plain", color: "Gold", selling_price: "329" },
    { _id: "p3", name: "Ivory Plain Blouse", category: "Blouse", subcategory: "Plain", color: "Ivory", selling_price: "299" },
    { _id: "p4", name: "Green Plain Blouse", category: "Blouse", subcategory: "Plain", color: "Green", selling_price: "319" },
    { _id: "p5", name: "Black Plain Blouse", category: "Blouse", subcategory: "Plain", color: "Black", selling_price: "399" },
    { _id: "p6", name: "Kalamkari Printed Blouse", category: "Blouse", subcategory: "Printed", blouseWork: "Kalamkari", color: "Multicolor", selling_price: "449" },
    { _id: "p7", name: "Daily Shapewear", category: "Shapewear", color: "Beige", selling_price: "299" },
];

test("normalizes supported chatbot product types", () => {
    assert.equal(normalizeProductType("Plain Blouse"), "plain_blouse");
    assert.equal(normalizeProductType("kalamkari_blouse"), "kalamkari_blouse");
    assert.equal(normalizeProductType("shapewear"), "shapewear");
    assert.throws(() => normalizeProductType("saree"), /Unsupported product type/);
});

test("filters products by selected chatbot product type", () => {
    assert.deepEqual(
        getEligibleProducts(products, "plain_blouse").map((product) => product._id),
        ["p1", "p2", "p3", "p4", "p5"]
    );

    assert.deepEqual(
        getEligibleProducts(products, "kalamkari_blouse").map((product) => product._id),
        ["p6"]
    );

    assert.deepEqual(
        getEligibleProducts(products, "shapewear").map((product) => product._id),
        ["p7"]
    );
});

test("keeps only valid AI product IDs and fills remaining top five from fallback", () => {
    const aiText = JSON.stringify({
        recommendations: [
            { productId: "p2", reason: "Warm gold adds festive contrast." },
            { productId: "fake", reason: "This must not be trusted." },
            { productId: "p2", reason: "Duplicate should be ignored." },
            { productId: "p4", reason: "Green gives a rich traditional pairing." },
        ],
    });

    const result = buildRecommendations({
        products: getEligibleProducts(products, "plain_blouse"),
        aiText,
        answers: { occasion: "wedding", desiredLook: "festive" },
        productType: "plain_blouse",
    });

    assert.equal(result.usedFallback, true);
    assert.deepEqual(
        result.recommendations.map((item) => item.product._id),
        ["p2", "p4", "p1", "p3", "p5"]
    );
    assert.equal(result.recommendations.length, 5);
    assert.ok(result.recommendations.every((item) => item.reason));
});

test("filters already shown products before requesting more suggestions", () => {
    const remainingProducts = filterAlreadyShownProducts(
        getEligibleProducts(products, "plain_blouse"),
        { shownProductIds: ["p1", "p2", "p3"] }
    );

    assert.deepEqual(
        remainingProducts.map((product) => product._id),
        ["p4", "p5"]
    );
});
