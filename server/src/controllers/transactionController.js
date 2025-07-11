const getLoggedEvents = require("../utils/getLoggedEvents");
const logToBlockchain = require("../utils/logToBlockchain"); // <-- Needed for log

const axios = require("axios");
const crypto = require("crypto");

// GET /api/transactions/all
exports.getAllTransactions = async (req, res) => {
	try {
		const events = await getLoggedEvents();
		console.log("🧪 Logs being returned to client:", events.length, events);
		res.status(200).json(events);
	} catch (err) {
		console.error("Failed to fetch events:", err);
		res.status(500).json({ message: "Error fetching blockchain logs" });
	}
};

// POST /api/transactions/log
exports.logTransaction = async (req, res) => {
	console.log("Incoming transaction log request:", req.body);
	const { user, amount, status, reason } = req.body;

	try {
		const tx = await logToBlockchain(user, amount, status, reason);
		res.status(200).json({ message: "Logged to blockchain", txHash: tx.hash });
	} catch (err) {
		console.error("Blockchain logging failed:", err);
		res.status(500).json({ error: "Failed to log transaction" });
	}
};

exports.checkout = async (req, res) => {
	const { features, amount, userId } = req.body;

	try {
		console.log("✅ Checkout API hit");

		const mlResponse = await axios.post("http://localhost:8000/predict", {
			features,
		});

		const isFraud = mlResponse.data.fraud;

		
		const reason = isFraud ? "fraud" : "normal";

		const txId = crypto
			.createHash("sha256")
			.update(`${userId}-${Date.now()}`)
			.digest("hex");

		console.log(" Generated txId:", txId);
		console.log(" Logging to blockchain with:", {
			txId,
			userId,
			amount,
			reason,
			isFraud,
		});

		// Log to blockchain
		await logToBlockchain(txId, userId, amount, reason, isFraud);

		console.log("✅ Successfully logged to blockchain");

		if (isFraud) {
			return res.status(403).json({ error: "Fraud suspected", txId });
		}

		res.status(200).json({ message: "Proceed to payment", txId });
	} catch (err) {
		console.error("❌ Checkout Error (Full):", err); // Log full stack trace
		res.status(500).json({ error: err.message || "Internal server error" });
	}
};
