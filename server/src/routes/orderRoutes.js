// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { verifyToken } = require("../middlewares/authMiddleware");
const PDFDocument = require("pdfkit");

// 1️⃣ Get user’s own orders
router.get("/user", verifyToken, async (req, res) => {
	try {
		const orders = await Order.find({ user: req.user.id }).sort({
			createdAt: -1,
		});
		res.status(200).json(orders);
	} catch (err) {
		res.status(500).json({ message: "Failed to fetch your orders" });
	}
});

// 2️⃣ Download invoice PDF
router.get("/:orderId/invoice", verifyToken, async (req, res) => {
	try {
		const order = await Order.findById(req.params.orderId).populate(
			"user",
			"email"
		);
		if (!order) return res.status(404).json({ message: "Order not found" });

		if (order.user._id.toString() !== req.user.id)
			return res.status(403).json({ message: "Not your order" });

		const doc = new PDFDocument();
		res.setHeader("Content-Type", "application/pdf");
		res.setHeader(
			"Content-Disposition",
			`attachment; filename=invoice-${order._id}.pdf`
		);
		doc.pipe(res);

		// 🧾 Invoice Content
		doc.fontSize(20).text("Invoice", { align: "center" });
		doc.moveDown();
		doc.fontSize(12).text(`Order ID: ${order._id}`);
		doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
		doc.text(`Customer: ${order.user.email}`);
		doc.moveDown();

		order.items.forEach((item, i) => {
			doc.text(`${i + 1}. ${item.name} × ${item.quantity} - $${item.price}`);
		});

		doc.moveDown();
		doc.text(`Total Amount: $${order.totalAmount}`);
		doc.text(`Payment Status: ${order.paymentStatus}`);
		doc.end();
	} catch (err) {
		res.status(500).json({ message: "Invoice generation failed" });
	}
});

module.exports = router;
