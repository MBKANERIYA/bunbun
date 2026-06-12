const express = require('express');
const { getAllBlogs, getSingleBlog, addBlog, updateBlog, deleteBlog, uploadBlogImageOnly } = require('../Controllers/Blog.Controller.js');
const upload = require("../Middleware/multer");

const router = express.Router();

router.get('/getAllBlogs', getAllBlogs);
router.get('/getSingleBlog/:id', getSingleBlog);
router.post('/addBlog', upload.single("image"), addBlog);
router.put('/updateBlog/:id', upload.single("image"), updateBlog);
router.delete('/deleteBlog/:id', deleteBlog);
router.post('/uploadImage', upload.single("file"), uploadBlogImageOnly);

module.exports = router;
