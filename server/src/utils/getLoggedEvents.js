const { ethers } = require("ethers");
require("dotenv").config();
const contractJson = require("./FraudLoggerABI.json");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contract = new ethers.Contract(
	process.env.CONTRACT_ADDRESS,
	contractJson.abi,
	provider
);

async function getLoggedEvents() {
	try {
		const filter = contract.filters.FraudLogged(); // get all events
		const events = await contract.queryFilter(filter, 0, "latest");

		const results = await Promise.all(
			events.map(async (e) => {
				const block = await e.getBlock(); // get timestamp from block

				return {
					txHash: e.transactionHash,
					txId: e.args.txId,
					user: e.args.user,
					amount: Number(e.args.amount),
					reason: e.args.reason,
					status: e.args.isFraud ? "Fraud" : "Legit",
					blockNumber: e.blockNumber,
					timestamp: new Date(block.timestamp * 1000).toISOString(), // convert to readable time
				};
			})
		);

		return results;
	} catch (err) {
		console.error("❌ Error fetching blockchain events:", err.message);
		throw err;
	}
}

module.exports = getLoggedEvents;
