const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, htmlContent) => {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	// Extract plain text from HTML by stripping tags (basic fallback)
	const textContent = htmlContent
		.replace(/<[^>]*>/g, "") // remove all tags
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&");

	await transporter.sendMail({
		from: `"WalmartLite" <${process.env.EMAIL_USER}>`,
		to,
		subject,
		text: textContent, // fallback for non-HTML clients
		html: htmlContent, // rendered version
	});
};

module.exports = sendEmail;
