const getLoggedEvents = require("../utils/getLoggedEvents");
const logToBlockchain = require("../utils/logToBlockchain"); // <-- Needed for log

// GET /api/transactions/all
exports.getAllTransactions = async (req, res) => {
	try {
		const events = await getLoggedEvents();
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
