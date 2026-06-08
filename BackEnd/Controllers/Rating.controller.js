const uploadImage = require("../Middleware/upload")
const { ratingSchema, userSchema, productSchema } = require("../Models")

module.exports.addRating = async (req, res) => {
    try {
        const { userId, productId, userRating, userReview } = req.body;
        const numericRating = Number(userRating);

        if (!userId || !productId || !numericRating) {
            return res.status(400).json({
                message: "All fields are required: userId, productId & userRating"
            });
        }

        if (numericRating < 1 || numericRating > 5) {
            return res.status(400).json({
                message: "userRating must be between 1 and 5."
            });
        }

        const user = await userSchema.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const product = await productSchema.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let productImage = null;
        if (req.file) {
            const { path, originalname } = req.file;
            const cloud = await uploadImage(path, originalname);
            productImage = cloud.url;
        }

        let existingRating = await ratingSchema.findOne({ productId });

        if (existingRating) {
            const userRatingIndex = existingRating.ratings.findIndex(
                r => r.userId.toString() === userId.toString()
            );

            if (userRatingIndex > -1) {
                existingRating.ratings[userRatingIndex].userRating = numericRating;
                existingRating.ratings[userRatingIndex].userReview = userReview;
                if (productImage) {
                    existingRating.ratings[userRatingIndex].productImage = productImage;
                }
            } else {
                existingRating.ratings.push({
                    userId,
                    userRating: numericRating,
                    userReview,
                    productImage
                });
            }

            await existingRating.save();

            return res.status(200).json({
                message: userRatingIndex > -1 ? "Review updated successfully" : "Review submitted successfully",
                existingRating
            });
        } else {
            const newRating = new ratingSchema({
                productId,
                ratings: [{ userId, userRating: numericRating, userReview, productImage }]
            });

            await newRating.save();

            return res.status(201).json({
                message: "Review submitted successfully",
                newRating
            });
        }
    } catch (err) {
        console.error("Error adding rating:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};


module.exports.getRatings = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({
                message: "ProductId is required"
            });
        }

        const productRatings = await ratingSchema.findOne({ productId })
            .populate({
                path: "productId",
                select: "name price images", 
            })
            .populate({
                path: "ratings.userId",
                select: "fullName email mobileNumber",
            });

        if (!productRatings) {
            return res.status(404).json({
                message: "No ratings found for this product"
            });
        }

        // calculate average rating
        const totalRatings = productRatings.ratings.length;
        const avgRating = totalRatings > 0
            ? (productRatings.ratings.reduce((acc, r) => acc + Number(r.userRating), 0) / totalRatings).toFixed(1)
            : 0;

        return res.status(200).json({
            message: "Ratings fetched successfully",
            totalRatings,
            averageRating: avgRating,
            product: productRatings.productId,
            ratings: productRatings.ratings
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};

module.exports.getAllReviews = async (req, res) => {
    try {
        const allRatings = await ratingSchema.find({})
            .populate({
                path: "productId",
                select: "name image slug",
            })
            .populate({
                path: "ratings.userId",
                select: "fullName mobileNumber",
            });

        // Flatten all reviews into a single array
        const reviews = [];
        for (const doc of allRatings) {
            if (!doc.productId) continue;
            for (const r of doc.ratings) {
                if (!r.userReview) continue; // skip reviews without text
                reviews.push({
                    _id: r._id,
                    userName: r.userId?.fullName || 'Customer',
                    userRating: r.userRating,
                    userReview: r.userReview,
                    productImage: r.productImage || doc.productId?.image,
                    productName: doc.productId?.name,
                    productSlug: doc.productId?.slug,
                    createdAt: r._id.getTimestamp(),
                });
            }
        }

        // Sort by newest first and limit to 20
        reviews.sort((a, b) => b.createdAt - a.createdAt);
        const limitedReviews = reviews.slice(0, 20);

        return res.status(200).json({
            message: "Reviews fetched successfully",
            reviews: limitedReviews,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
};
