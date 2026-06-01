const mongoose = require("mongoose");
const Category = require("./Models/Category.Model.js");

mongoose.connect("mongodb+srv://Maulik:iTC9SBDsz1paZivD@cluster0.pkkznzw.mongodb.net/test?retryWrites=true&w=majority")
.then(async () => {
    console.log("Connected to MongoDB.");
    
    // Clear existing just in case
    await Category.deleteMany({});
    
    const categories = [
        {
            slug: "blouse",
            title: "BLOUSE",
            description: "Explore our beautiful collection of premium blouses.",
            products: []
        },
        {
            slug: "shapewear",
            title: "SHAPEWEAR",
            description: "Comfortable and contouring shapewear for everyday use.",
            products: []
        }
    ];
    
    await Category.insertMany(categories);
    console.log("Inserted categories successfully.");
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
