const express = require("express");
const router = express.Router();
const {
	logTransaction,
	getAllTransactions,
} = require("../controllers/transactionController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/log", protect, logTransaction);
router.get("/all", protect, getAllTransactions); // new route

module.exports = router;
