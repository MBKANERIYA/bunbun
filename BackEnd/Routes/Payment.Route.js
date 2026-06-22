const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { productSchema, cartSchema } = require("../Models");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/create-order", async (req, res) => {
    try {
        const { isGuest, items } = req.body;
        let cartItems = [];

        if (isGuest) {
            if (!items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ message: "Guest items are required" });
            }
            // Fetch product details for guest items from DB
            for (const item of items) {
                const product = await productSchema.findById(item.productId);
                if (!product) {
                    return res.status(404).json({ message: `Product ${item.productId} not found` });
                }
                cartItems.push({
                    productId: product,
                    quantity: Number(item.quantity) || 1,
                    size: item.size
                });
            }
        } else {
            // Authenticated user
            const authHeader = req.headers["auth"];
            if (!authHeader) {
                return res.status(401).json({ message: "Authentication required for registered users" });
            }
            const token = authHeader.split(" ")[1];
            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (e) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            const userId = decoded.userId || decoded._id;
            const cart = await cartSchema.findOne({ userId }).populate("product.productId");
            if (!cart || !cart.product || cart.product.length === 0) {
                return res.status(400).json({ message: "Your cart is empty" });
            }

            cartItems = cart.product.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                size: item.size
            }));
        }

        const parsePrice = (price) => {
            if (typeof price === 'number') return price;
            const cleanedPrice = String(price || '').replace(/[^0-9.]/g, '');
            return Number(cleanedPrice) || 0;
        };

        // Calculate subtotal
        let subtotal = 0;
        cartItems.forEach(item => {
            const price = parsePrice(item.productId.selling_price);
            subtotal += price * item.quantity;
        });

        // Calculate combo discount based on quantity and category
        let plainBlouseItems = [];
        let printedBlouseItems = [];
        let shapewearItems = [];

        cartItems.forEach(item => {
            const product = item.productId;
            if (!product) return;
            const price = parsePrice(product.selling_price);
            const qty = Number(item.quantity) || 1;

            for (let i = 0; i < qty; i++) {
                if (product.category === "Blouse" && product.subcategory === "Plain") {
                    plainBlouseItems.push(price);
                } else if (product.category === "Blouse" && product.subcategory === "Printed") {
                    printedBlouseItems.push(price);
                } else if (product.category === "Shapewear") {
                    shapewearItems.push(price);
                }
            }
        });

        plainBlouseItems.sort((a, b) => a - b);
        printedBlouseItems.sort((a, b) => a - b);
        shapewearItems.sort((a, b) => a - b);

        let comboDiscountAmount = 0;

        while (shapewearItems.length >= 2) {
            let p1 = shapewearItems.pop();
            let p2 = shapewearItems.pop();
            if ((p1 + p2) > 499) comboDiscountAmount += (p1 + p2) - 499;
        }

        while (plainBlouseItems.length >= 2) {
            let p1 = plainBlouseItems.pop();
            let p2 = plainBlouseItems.pop();
            if ((p1 + p2) > 629) comboDiscountAmount += (p1 + p2) - 629;
        }

        while (printedBlouseItems.length >= 2) {
            let p1 = printedBlouseItems.pop();
            let p2 = printedBlouseItems.pop();
            if ((p1 + p2) > 799) comboDiscountAmount += (p1 + p2) - 799;
        }

        const finalTotal = subtotal - comboDiscountAmount;

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        const options = {
            amount: Math.round(finalTotal * 100), // amount in paise
            currency: "INR",
            receipt: "receipt_order_" + Math.floor(Math.random() * 1000),
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
    } catch (error) {
        console.error("Razorpay order creation error:", error);
        res.status(500).send(error.message || error);
    }
});

router.post("/verify-payment", async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            return res.status(200).json({ message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
