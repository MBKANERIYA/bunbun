const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./Models/Product.Model.js');

const generateSlug = (name) => {
    return (name || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};

const makeUniqueSlug = async (name, existingSlugs) => {
    let baseSlug = generateSlug(name);
    let slug = baseSlug;
    let count = 1;
    while (existingSlugs.has(slug)) {
        slug = `${baseSlug}-${count}`;
        count++;
    }
    existingSlugs.add(slug);
    return slug;
};

mongoose.connect(process.env.DB_URL).then(async () => {
    console.log('Connected to DB');
    const products = await Product.find({});
    
    // Get existing slugs
    const existingSlugs = new Set();
    for (let p of products) {
        if (p.slug) existingSlugs.add(p.slug);
    }
    
    for (let product of products) {
        if (!product.slug || product.slug.includes('%')) {
            const oldSlug = product.slug;
            if (oldSlug) existingSlugs.delete(oldSlug); // free it up if it was a bad one
            product.slug = await makeUniqueSlug(product.name, existingSlugs);
            await product.save();
            console.log('Updated', product.name, 'to slug:', product.slug);
        }
    }
    console.log('Done');
    process.exit(0);
}).catch(console.error);
