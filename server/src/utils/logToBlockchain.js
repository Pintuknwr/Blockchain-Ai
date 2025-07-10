// server/utils/logToBlockchain.js
const { ethers } = require("ethers");
require("dotenv").config();
const contractJson = require("./FraudLoggerABI.json");

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;

if (!CONTRACT_ADDRESS || !PRIVATE_KEY || !RPC_URL) {
	throw new Error(
		"❌ Missing CONTRACT_ADDRESS, PRIVATE_KEY, or RPC_URL in .env"
	);
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(
	CONTRACT_ADDRESS,
	contractJson.abi,
	wallet
);

console.log(
	"🔍 Logging to contract address:",
	contract.target || contract.address
);

async function logToBlockchain(txId, user, amount, reason, isFraud) {
	try {
		const tx = await contract.logFraud(txId, user, amount, reason, isFraud);
		await tx.wait(); // Wait for confirmation
		console.log(`✅ Fraud logged to chain: ${txId} (${isFraud})`);
		return tx;
	} catch (err) {
		console.error("❌ Blockchain logging failed:", err.message);
		throw err;
	}
}

module.exports = logToBlockchain;
