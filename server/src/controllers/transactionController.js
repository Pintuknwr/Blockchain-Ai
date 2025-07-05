const logToBlockchain = require("../utils/logToBlockchain");

exports.logTransaction = async (req, res) => {
	const { user, amount, status, reason } = req.body;

	try {
		const tx = await logToBlockchain(user, amount, status, reason);
		res.status(200).json({ message: "Logged to blockchain", txHash: tx.hash });
	} catch (err) {
		console.error("Blockchain logging failed:", err);
		res.status(500).json({ error: "Failed to log transaction" });
	}
};
