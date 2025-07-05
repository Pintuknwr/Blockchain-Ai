const express = require("express");
//const dotenv = require('dotenv');
const mongoose = require("mongoose");
const cors = require("cors");
//const morgan = require('morgan');
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	})
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "8kb" }));
app.use(express.static("public"));

//app.use(morgan('dev'));
app.use(cookieParser());

// Routes

const userRouter = require("./routes/userRoute");
app.use("/api/user", userRouter);

const transactionRoutes = require("./routes/transactionRoutes");
app.use("/api/transactions", transactionRoutes);

module.exports = app;
