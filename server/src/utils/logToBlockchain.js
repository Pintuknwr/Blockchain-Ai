const { ethers } = require("ethers");
const contractJson = require("./FraudLoggerABI.json");

const CONTRACT_ADDRESS = "0x..."; // <-- paste your deployed address
const PRIVATE_KEY = "0x..."; // <-- from hardhat node accounts
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(
	CONTRACT_ADDRESS,
	contractJson.abi,
	wallet
);

async function logFraud(txId, isFraud) {
	const tx = await contract.logFraud(txId, isFraud);
	await tx.wait();
	console.log(`✅ Fraud logged: ${txId} (${isFraud})`);
}

module.exports = logFraud;
