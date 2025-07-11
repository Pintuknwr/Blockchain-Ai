const express = require("express");
const router = express.Router();
const { createPaymentIntent } = require("../controllers/paymentController");
const { verifyToken } = require("../middlewares/authMiddleware");
const Order = require("../models/Order");

// POST /api/payment/create-payment-intent
router.post("/create-payment-intent", createPaymentIntent);

// ✅ Save order after payment
router.post("/save-order", verifyToken, async (req, res) => {
	try {
		const { items, totalAmount } = req.body;

		const newOrder = new Order({
			user: req.user.id,
			items,
			totalAmount,
			paymentStatus: "Paid",
		});

		await newOrder.save();
		res.status(201).json({ message: "Order saved", order: newOrder });
	} catch (err) {
		console.error("❌ Failed to save order:", err);
		res.status(500).json({ message: "Order save failed" });
	}
});
module.exports = router;
