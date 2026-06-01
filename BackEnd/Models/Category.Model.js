const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "productSchema" }]
}, { timestamps: true });

let Category = mongoose.model("Category", categorySchema);

module.exports = Category;
