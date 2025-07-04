const hre = require("hardhat");

async function main() {
	const FraudLogger = await hre.ethers.getContractFactory("FraudLogger");
	const fraudLogger = await FraudLogger.deploy();
	await fraudLogger.waitForDeployment();

	console.log("✅ Contract deployed to:", fraudLogger.target);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
