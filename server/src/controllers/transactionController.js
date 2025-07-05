const getLoggedEvents = require("../utils/getLoggedEvents");

exports.getAllTransactions = async (req, res) => {
	try {
		const events = await getLoggedEvents();
		res.status(200).json(events);
	} catch (err) {
		console.error("Failed to fetch events:", err);
		res.status(500).json({ message: "Error fetching blockchain logs" });
	}
};
