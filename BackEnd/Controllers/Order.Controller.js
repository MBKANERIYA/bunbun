const { orderSchema } = require("../Models");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderSchema
      .find({})
      .populate("userId", "firstName lastName email")
      .populate("items.productId", "name image selling_price mrp slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All orders fetched successfully",
      data: orders
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      message: "Server error while fetching all orders",
      error: error.message
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const orders = await orderSchema
      .find({ userId })
      .populate("items.productId", "name image selling_price mrp slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Orders fetched successfully",
      data: orders
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      message: "Server error while fetching orders",
      error: error.message
    });
  }
};

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
