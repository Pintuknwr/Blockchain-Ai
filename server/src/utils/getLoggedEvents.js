// server/utils/getLoggedEvents.js
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
	const filter = contract.filters.FraudLogged(); // no filter params = all events
	const events = await contract.queryFilter(filter, 0, "latest");

	return events.map((e) => ({
		txHash: e.transactionHash,
		txId: e.args.txId,
		isFraud: e.args.isFraud,
		blockNumber: e.blockNumber,
		timestamp: null, // we'll fill this in next step
	}));
}

module.exports = getLoggedEvents;
