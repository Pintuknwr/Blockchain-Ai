const jwt = require("jsonwebtoken");
const User = require("../models/userModels.js");

exports.protect = async (req, res, next) => {
	let token;
	if (req.headers.authorization?.startsWith("Bearer")) {
		try {
			token = req.headers.authorization.split(" ")[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await User.findById(decoded.id).select("-password");
			next();
		} catch (error) {
			res.status(401).json({ message: "Not authorized" });
		}
	}

	if (!token) {
		res.status(401).json({ message: "No token, not authorized" });
	}
};

exports.adminOnly = (req, res, next) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({ message: "Access denied. Admins only." });
	}
	next();
};

exports.verifyToken = (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) return res.status(401).json({ message: "Missing token" });

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded; // { id: userId, role: 'user' }
		next();
	} catch (err) {
		res.status(400).json({ message: "Invalid token" });
	}
};
