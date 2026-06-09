const { userSchema, productSchema, cartSchema } = require("../Models");
const { cartService } = require("../Services");

module.exports.createCart = async (req, res) => {
    try {
        let { userId, productId, quantity = 1, size } = req.body;
        quantity = Number(quantity) || 1;

        let user = await userSchema.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        let product = await productSchema.findById(productId)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        let totalPrice = product.selling_price * quantity

        let cart = await cartSchema.findOne({ userId })

        if (cart) {
            let existingProduct = cart.product.find(
                (item) => item.productId.toString() === productId.toString() && item.size === size
            );
            if (existingProduct) {
                existingProduct.quantity += quantity
                existingProduct.totalPrice = existingProduct.quantity * product.selling_price
            } else {
                cart.product.push({ productId, quantity, size, totalPrice })
            }
            cart.cartTotal = cart.product.reduce((sum, item) => sum + item.totalPrice, 0)
            await cart.save()
        } else {
            cart = await cartService.createCart({
                userId,
                product: [{ productId, quantity, size, totalPrice }],
                cartTotal: totalPrice
            })
        }

        res.status(201).json({
            message: "Cart created successfully",
            cart
        })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

module.exports.getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        let user = await userSchema.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const cart = await cartSchema.findOne({ userId }).populate("userId").populate("product.productId")

        if (!cart) {
            return res.status(200).json({
                message: "Cart is empty",
                cart: {
                    userId,
                    product: [],
                    cartTotal: 0
                }
            })
        }
        res.status(200).json({
            message: "Cart Fetched Successfully",
            cart
        })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

module.exports.updateCartQuantity = async (req, res) => {
    try {
        const { userId, productId, action } = req.body;

        if (!["increment", "decrement"].includes(action)) {
            return res.status(400).json({ message: "Invalid action" });
        }

        let cart = await cartSchema.findOne({ userId }).populate("product.productId");
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        let item = cart.product.find(
            (p) => p.productId._id.toString() === productId.toString()
        );
        if (!item) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        if (action === "increment") {
            item.quantity += 1;
        } else if (action === "decrement") {
            item.quantity -= 1;
            if (item.quantity <= 0) {
                cart.product = cart.product.filter(
                    (p) => p.productId._id.toString() !== productId.toString()
                );
            }
        }
        cart.product.forEach((p) => {
            p.totalPrice = p.productId.selling_price * p.quantity;
        });

        cart.cartTotal = cart.product.reduce((sum, p) => sum + p.totalPrice, 0);

        await cart.save();

        res.status(200).json({
            message: "Cart updated successfully",
            cart
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports.removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        // Find the user's cart
        let cart = await cartSchema.findOne({ userId }).populate("product.productId");
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Check if product exists in the cart
        const exists = cart.product.some(
            (p) => p.productId._id.toString() === productId.toString()
        );
        if (!exists) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        // Remove product from cart
        cart.product = cart.product.filter(
            (p) => p.productId._id.toString() !== productId.toString()
        );

        // Recalculate totals
        cart.cartTotal = cart.product.reduce((sum, p) => {
            return sum + p.productId.selling_price * p.quantity;
        }, 0);

        // Save updated cart
        await cart.save();

        res.status(200).json({
            message: "Product removed from cart successfully",
            cart
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.clearCart = async (req, res) => {
    try {
        const { userId } = req.params;
        let cart = await cartSchema.findOne({ userId });
        
        if (cart) {
            cart.product = [];
            cart.cartTotal = 0;
            await cart.save();
        }

        res.status(200).json({
            message: "Cart cleared successfully",
            cart: cart || { userId, product: [], cartTotal: 0 }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
