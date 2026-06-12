const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  imageUrl: { type: String, required: true },
  author: { type: String, default: 'Admin' },
  readTime: { type: String },
  slug: { type: String },
  metaTitle: { type: String },
  metaDescription: { type: String },
  keywords: [{ type: String }],
  canonicalUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
