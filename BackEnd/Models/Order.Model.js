const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserSchema",
        required: function() { return !this.guestInfo; }
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "productSchema",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        size: {
            type: String
        },
        price: {
            type: Number,
            required: true
        }
    }],
    amount: {
        subtotal: { type: Number, required: true },
        shippingCharges: { type: Number, default: 0 },
        couponDiscount: { type: Number, default: 0 },
        total: { type: Number, required: true }
    },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    billingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
        default: 'Pending'
    },
    paymentDetails: {
        paymentId: { type: String },
        paymentMethod: { type: String, enum: ['Credit Card', 'Debit Card', 'Net Banking', 'COD', 'Razorpay'], required: true },
        paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' }
    },
    guestInfo: {
        name: { type: String },
        phone: { type: String }
    }
}, {
    timestamps: true
});

const Order = mongoose.models.orderSchema || mongoose.model("orderSchema", orderSchema);

module.exports = Order;