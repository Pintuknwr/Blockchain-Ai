const express = require("express");
const router = express.Router();
const {
	logTransaction,
	getAllTransactions,
} = require("../controllers/transactionController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

const { checkout } = require("../controllers/transactionController");

router.post("/log", protect, logTransaction);
// router.post("/log", logTransaction);
// router.get("/all", getAllTransactions); // new route
router.get("/all", protect, adminOnly, getAllTransactions); // new route

router.post("/checkout", protect, checkout); 

module.exports = router;
