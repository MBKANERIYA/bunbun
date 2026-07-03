const Blog = require('../Models/Blog.Model.js');
const uploadImage = require("../Middleware/upload");
const fs = require("fs/promises");

const uploadBlogFile = async (file) => {
    try {
        const cloud = await uploadImage(file.path);
        return cloud.secure_url || cloud.url;
    } finally {
        await fs.unlink(file.path).catch(() => {});
    }
};

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ id: -1 });
        res.status(200).json({ success: true, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getSingleBlog = async (req, res) => {
    try {
        const param = req.params.id;
        let blog = null;
        
        // Try searching by slug first if it's a string, or by ID if it parses to a valid number
        if (!isNaN(param)) {
            blog = await Blog.findOne({ id: parseInt(param) });
        }
        if (!blog) {
            blog = await Blog.findOne({ slug: param });
        }
        
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        res.status(200).json({ success: true, blog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const addBlog = async (req, res) => {
    try {
        const { title, excerpt, content, category, author, readTime, slug, metaTitle, metaDescription, canonicalUrl } = req.body;
        let keywords = req.body.keywords;

        if (!title || !excerpt || !content || !category) {
            return res.status(400).json({ success: false, message: "Required fields missing" });
        }
        
        let imageUrl = '';
        if (req.file) {
            imageUrl = await uploadBlogFile(req.file);
        } else if (req.body.imageUrl) {
            imageUrl = req.body.imageUrl;
        } else {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        let parsedKeywords = [];
        if (keywords && typeof keywords === 'string') {
            parsedKeywords = keywords.split(',').map(k => k.trim()).filter(k => k);
        } else if (Array.isArray(keywords)) {
            parsedKeywords = keywords;
        }

        const dateString = req.body.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        const newBlog = new Blog({
            id: Date.now(),
            title,
            excerpt,
            content,
            category,
            date: dateString,
            imageUrl,
            author: author || 'Admin',
            readTime,
            slug,
            metaTitle,
            metaDescription,
            keywords: parsedKeywords,
            canonicalUrl
        });

        await newBlog.save();
        res.status(201).json({ success: true, message: "Blog added successfully", blog: newBlog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };
        
        if (req.file) {
            updates.imageUrl = await uploadBlogFile(req.file);
        }

        if (updates.keywords && typeof updates.keywords === 'string') {
            updates.keywords = updates.keywords.split(',').map(k => k.trim()).filter(k => k);
        }

        // Support both MongoDB _id or custom id/slug
        let query = { _id: id };
        if (id.length < 24) {
             query = { slug: id }; // or custom id
             if (!isNaN(id)) query = { $or: [{ id: parseInt(id) }, { slug: id }] };
        }

        const updatedBlog = await Blog.findOneAndUpdate(query, updates, { new: true });
        if (!updatedBlog) return res.status(404).json({ success: false, message: "Blog not found" });

        res.status(200).json({ success: true, message: "Blog updated successfully", blog: updatedBlog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        let query = { _id: id };
        if (id.length < 24) {
             query = { slug: id }; 
             if (!isNaN(id)) query = { $or: [{ id: parseInt(id) }, { slug: id }] };
        }

        const deletedBlog = await Blog.findOneAndDelete(query);
        if (!deletedBlog) return res.status(404).json({ success: false, message: "Blog not found" });

        res.status(200).json({ success: true, message: "Blog deleted successfully", blog: deletedBlog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const uploadBlogImageOnly = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No image uploaded" });
        const url = await uploadBlogFile(req.file);
        res.status(200).json({ url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllBlogs,
    getSingleBlog,
    addBlog,
    updateBlog,
    deleteBlog,
    uploadBlogImageOnly
};
