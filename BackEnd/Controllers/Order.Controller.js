const { orderSchema } = require("../Models");

exports.createOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      amount,
      shippingAddress,
      billingAddress,
      paymentDetails
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "At least one item is required" });
    }

    if (!amount || !amount.subtotal || !amount.total) {
      return res.status(400).json({ message: "Order amount details are required" });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ message: "Complete shipping address is required" });
    }

    if (!billingAddress || !billingAddress.street || !billingAddress.city) {
      return res.status(400).json({ message: "Complete billing address is required" });
    }

    if (!paymentDetails || !paymentDetails.paymentMethod) {
      return res.status(400).json({ message: "Payment method is required" });
    }

    // ✅ Create new order
    const newOrder = new orderSchema({
      userId,
      items,
      amount,
      shippingAddress,
      billingAddress,
      paymentDetails
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      data: newOrder
    });

  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      message: "Server error while creating order",
      error: error.message
    });
  }
};
