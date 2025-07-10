const axios = require("axios");
require("dotenv").config({ path: "../.env" }); // make sure this line is included

const validateEmail = async (email) => {
	const API_KEY = process.env.EMAILVALIDATION_API_KEY;
	const API_URL = `https://api.emailvalidation.io/v1/info?apikey=${API_KEY}&email=${email}`;

	try {
		const response = await axios.get(API_URL);
		const data = response.data;

		if (
			data.state === "deliverable" &&
			data.smtp_check === true &&
			data.disposable === false
		) {
			return { valid: true };
		} else {
			return { valid: false, reason: data };
		}
	} catch (error) {
		console.error(
			"❌ Email validation error:",
			error.response?.data || error.message
		);
		return { valid: false, reason: "API error" };
	}
};

module.exports = validateEmail;
