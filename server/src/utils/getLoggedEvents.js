// server/utils/getLoggedEvents.js
const { ethers } = require("ethers");
require("dotenv").config();
const contractJson = require("./FraudLoggerABI.json");

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RPC_URL = process.env.RPC_URL;

if (!CONTRACT_ADDRESS || !RPC_URL) {
	throw new Error("❌ Missing CONTRACT_ADDRESS or RPC_URL in .env");
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(
	CONTRACT_ADDRESS,
	contractJson.abi,
	provider
);

console.log("🧾 Reading from contract:", CONTRACT_ADDRESS);

async function getLoggedEvents() {
	try {
		const event = await contract.getEvent("FraudLogged");
		const logs = await contract.queryFilter(event, 0, "latest"); // ✅ correct for v6

		console.log("📦 Events fetched:", logs.length);

		if (logs.length === 0) {
			console.log("⚠️ No blockchain logs returned.");
			return [];
		}

		const parsed = await Promise.all(
			logs.map(async (e) => {
				const block = await provider.getBlock(e.blockNumber);
				console.log("🔍 Raw log event:", e.args);

				return {
					txHash: e.transactionHash,
					txId: e.args.txId,
					user: e.args.user,
					amount: Number(e.args.amount),
					reason: e.args.reason,
					status: e.args.isFraud ? "Fraud" : "Legit",
					blockNumber: e.blockNumber,
					timestamp: new Date(block.timestamp * 1000).toISOString(),
				};
			})
		);

		console.log("✅ Parsed logs:", parsed);
		return parsed;
	} catch (err) {
		console.error("❌ Error in getLoggedEvents:", err);
		throw err;
	}
}

module.exports = getLoggedEvents;
