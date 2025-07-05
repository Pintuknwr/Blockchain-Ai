const { ethers } = require("ethers");
require("dotenv").config(); // ← Ensure envs are loaded

const contractJson = require("./FraudLoggerABI.json");

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;

if (!CONTRACT_ADDRESS || !PRIVATE_KEY || !RPC_URL) {
	throw new Error("Missing blockchain config in environment variables");
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const contract = new ethers.Contract(
	CONTRACT_ADDRESS,
	contractJson.abi,
	wallet
);

async function logToBlockchain(user, amount, status, reason) {
	const txId = `${user}-${Date.now()}`; // simple txId
	const isFraud = reason === "fraud";

	const tx = await contract.logFraud(txId, isFraud);
	await tx.wait();

	console.log(`✅ Fraud logged to chain: ${txId} (${isFraud})`);
	return tx;
}

module.exports = logToBlockchain;
