const { userSchema, productSchema, wishlistSchema } = require("../Models");
const { wishlistService } = require("../Services");


module.exports.createWishlist = async (req, res) => {
    try {
        let { userId, productId } = req.body;
        let user = await userSchema.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let product = await productSchema.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        let wishlist = await wishlistSchema.findOne({ userId });

        if (wishlist) {
            let existingProduct = wishlist.product.find(
                (item) => item.productId.toString() === productId.toString()
            );

            if (existingProduct) {
                return res.status(200).json({
                    message: "Product already in wishlist",
                    wishlist
                });
            } else {
                wishlist.product.push({ productId });
                await wishlist.save();
            }
        } else {
            wishlist = await wishlistSchema.create({
                userId,
                product: [{ productId }]
            });
        }

        res.status(201).json({
            message: "Wishlist updated successfully",
            wishlist
        });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

module.exports.getWishlist = async (req, res) => {
    try {
        const { userId } = req.params

        let user = await userSchema.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }

        let wishlist = await wishlistService.getWishlist(userId)
        if (!wishlist) {
            return res.status(200).json({
                message: "wishlist is empty",
                wishlist: {
                    userId,
                    product: []
                }
            })
        }

        res.status(200).json({
            message: "wishlist get successfully",
            wishlist
        })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}


module.exports.removeFromWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        let wishlist = await wishlistSchema.findOne({ userId }).populate("product.productId");
        if (!wishlist) {
            return res.status(200).json({
                message: "Wishlist is already empty",
                wishlist: { userId, product: [] }
            });
        }

        const exists = wishlist.product.some(
            (p) => p.productId._id.toString() === productId.toString()
        );
        if (!exists) {
            return res.status(200).json({
                message: "Product is not in wishlist",
                wishlist
            });
        }

        wishlist.product = wishlist.product.filter(
            (p) => p.productId._id.toString() !== productId.toString()
        );

        await wishlist.save();

        res.status(200).json({
            message: "Product removed from wishlist successfully",
            wishlist
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
