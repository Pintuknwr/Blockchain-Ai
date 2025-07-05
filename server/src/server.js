const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const app = require("./app.js");

dotenv.config();

// Connect DB and start server

connectDB()
	.then(() => {
		app.listen(process.env.PORT || 3000, () => {
			console.log(`Server running on port ${process.env.PORT}`);
		});
	})
	.catch((error) => {
		console.error("Failed to connect to the database:", error);
		process.exit(1);
	});
