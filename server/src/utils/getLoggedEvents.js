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
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractJson.abi, provider);

console.log("🔍 Logging to contract address:", contract.target || contract.address);


async function getLoggedEvents() {
	try {
		// In Ethers v6, you can directly use the event name
		const logs = await contract.queryFilter("FraudLogged");

		console.log("📦 Events found:", logs.length);

		const events = await Promise.all(
			logs.map(async (e) => {
				const block = await provider.getBlock(e.blockNumber);
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

		return events;
	} catch (err) {
		console.error("❌ Error fetching blockchain logs:", err.message);
		throw err;
	}
}

module.exports = getLoggedEvents;
