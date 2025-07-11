const User = require("../models/userModels.js");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const validateEmail = require("../utils/validateEmail");
const validator = require("validator");

const majorDomains = [
	"gmail.com",
	"yahoo.com",
	"hotmail.com",
	"outlook.com",
	"protonmail.com",
	"icloud.com",
	"aol.com",
	"zoho.com",
];
const sendEmail = require("../utils/sendEmail");

// Generate token
const generateToken = (id, role) => {
	return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
// @desc Register user
exports.registerUser = async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return res
			.status(400)
			.json({ message: "Please provide name, email, and password." });
	}

	// Basic format check
	if (!validator.isEmail(email)) {
		return res.status(400).json({ message: "Invalid email format." });
	}

	// Domain check
	const domain = email.split("@")[1];
	if (!majorDomains.includes(domain)) {
		return res.status(400).json({
			message: "Please use a valid email from Gmail, Yahoo, Outlook, etc.",
		});
	}

	// API-level email existence check
	const { valid, reason } = await validateEmail(email);
	if (!valid) {
		return res.status(400).json({
			message: "Email validation failed. Please use a real, deliverable email.",
			details: reason,
		});
	}

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "Email already in use." });
		}

		const newUser = new User({ name, email, password });
		await newUser.save();

		res.status(201).json({ message: "User registered successfully!" });
	} catch (error) {
		console.error("Registration Error:", error);
		res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
	}
};

// @desc Login user
exports.loginUser = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (!user || !(await user.matchPassword(password))) {
		return res.status(401).json({ message: "Invalid credentials" });
	}

	// ✅ If MFA is enabled, return temp token
	if (user.isMfaEnabled) {
		const tempToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "10m",
		});
		return res.json({ mfaRequired: true, tempToken });
	}

	// ✅ If MFA not enabled, return full access token
	const token = jwt.sign(
		{ id: user._id, role: user.role },
		process.env.JWT_SECRET,
		{
			expiresIn: "30d",
		}
	);

	res.json({
		_id: user._id,
		name: user.name,
		email: user.email,
		role: user.role,
		isMfaEnabled: user.isMfaEnabled, // ✅ include this
		token,
	});
};

// @desc Get current user
exports.getMe = async (req, res) => {
	const user = await User.findById(req.user.id).select("-password");
	res.status(200).json(user);
};

// GET /user/enable-mfa
exports.generateMfaSecret = async (req, res) => {
	try {
		const secret = speakeasy.generateSecret({
			name: `WalmartLite (${req.user.email})`,
		});

		const qrUrl = await qrcode.toDataURL(secret.otpauth_url);
		res.json({ base32: secret.base32, qrUrl });
	} catch (err) {
		console.error("🔴 MFA QR Generation Error:", err);
		res.status(500).json({ message: "Failed to generate MFA secret" });
	}
};

// POST /user/confirm-mfa

exports.confirmMfaCode = async (req, res) => {
	const { code, secret } = req.body;

	const verified = speakeasy.totp.verify({
		secret,
		encoding: "base32",
		token: code,
		window: 1,
	});

	if (!verified) {
		return res.status(400).json({ message: "Invalid MFA code" });
	}

	req.user.mfaSecret = secret;
	req.user.isMfaEnabled = true;
	await req.user.save();

	res.json({ message: "MFA enabled successfully!" });
};

exports.requestPasswordOtp = async (req, res) => {
	const { email } = req.body;
	const user = await User.findOne({ email });

	if (!user) return res.status(404).json({ message: "User not found" });

	const otp = Math.floor(100000 + Math.random() * 900000).toString();

	user.resetOtp = otp;
	user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
	await user.save();

	await sendEmail(
		user.email,
		"Your OTP for Password Reset",
		`Your 6-digit OTP is: ${otp}. It is valid for 10 minutes.`
	);

	res.json({ message: "OTP sent to email" });
};

exports.verifyPasswordOtpAndReset = async (req, res) => {
	const { email, otp, newPassword } = req.body;

	const user = await User.findOne({ email });

	if (
		!user ||
		user.resetOtp !== otp ||
		!user.resetOtpExpiry ||
		user.resetOtpExpiry < Date.now()
	) {
		return res.status(400).json({ message: "Invalid or expired OTP" });
	}

	user.password = newPassword;
	user.resetOtp = undefined;
	user.resetOtpExpiry = undefined;
	await user.save();

	res.json({ message: "Password reset successful" });
};

exports.requestMfaOtp = async (req, res) => {
	const { email } = req.body;
	const user = await User.findOne({ email });

	if (!user || !user.isMfaEnabled) {
		return res.status(400).json({ message: "No MFA enabled for this user." });
	}

	const otp = Math.floor(100000 + Math.random() * 900000).toString();
	user.resetOtp = otp;
	user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 min
	await user.save();

	await sendEmail(
		email,
		"MFA Recovery OTP",
		`Your OTP to recover MFA is: ${otp}. It expires in 10 minutes.`
	);

	res.json({ message: "OTP sent to email." });
};

exports.verifyMfaOtp = async (req, res) => {
	const { email, otp } = req.body;

	const user = await User.findOne({ email });
	if (
		!user ||
		user.resetOtp !== otp ||
		!user.resetOtpExpiry ||
		user.resetOtpExpiry < Date.now()
	) {
		return res.status(400).json({ message: "Invalid or expired OTP" });
	}

	// Disable MFA
	user.isMfaEnabled = false;
	user.mfaSecret = undefined;
	user.resetOtp = undefined;
	user.resetOtpExpiry = undefined;
	await user.save();

	// Generate full token and log in
	const token = jwt.sign(
		{ id: user._id, role: user.role },
		process.env.JWT_SECRET,
		{
			expiresIn: "30d",
		}
	);

	res.json({
		message: "MFA disabled. Login successful.",
		user: {
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			isMfaEnabled: false,
		},
		token,
	});
};

exports.verifyMfaCode = async (req, res) => {
	const { tempToken, code } = req.body;

	try {
		// Step 1: Decode tempToken to get user ID
		const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id);
		if (!user) return res.status(404).json({ message: "User not found" });

		// Step 2: Verify the code using the stored mfaSecret
		const verified = speakeasy.totp.verify({
			secret: user.mfaSecret,
			encoding: "base32",
			token: code,
			window: 1,
		});

		if (!verified) {
			return res.status(400).json({ message: "Invalid MFA code" });
		}

		// Step 3: Generate full token and send
		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{
				expiresIn: "30d",
			}
		);

		res.json({
			message: "Login successful",
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				isMfaEnabled: true,
			},
			token,
		});
	} catch (err) {
		console.error("MFA Verification failed:", err);
		res.status(401).json({ message: "MFA verification failed" });
	}
};
