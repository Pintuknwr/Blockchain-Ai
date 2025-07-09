const { ethers } = require("ethers");
require("dotenv").config();

const contractJson = require("./FraudLoggerABI.json");

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;

if (!CONTRACT_ADDRESS || !PRIVATE_KEY || !RPC_URL) {
	throw new Error("❌ Missing blockchain config in environment variables");
}

const provider = new ethers.JsonRpcProvider(RPC_URL);

// ✅ Use wallet as signer
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const contract = new ethers.Contract(
	CONTRACT_ADDRESS,
	contractJson.abi,
	wallet
);

async function logToBlockchain(txId, user, amount, reason, isFraud) {
	//txId = `${user}-${Date.now()}`; // simple txId
	//isFraud = reason === "fraud";

	try {
		const tx = await contract.logFraud(txId, user, amount, reason, isFraud);
		

		await tx.wait();
		console.log(`✅ Fraud logged to chain: ${txId} (${isFraud})`);
		return tx;
	} catch (err) {
		console.error("❌ Blockchain logging failed:", err.message);
		throw err;
	}
}

module.exports = logToBlockchain;
