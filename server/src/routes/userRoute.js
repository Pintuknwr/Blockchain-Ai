const express = require("express");
const {
	registerUser,
	loginUser,
	getMe,
	generateMfaSecret,
	confirmMfaCode,
	requestPasswordOtp,
	verifyPasswordOtpAndReset,
	requestMfaOtp,
	verifyMfaOtp,
	verifyMfaCode,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/me", protect, getMe);
router.get("/enable-mfa", protect, generateMfaSecret);
router.post("/confirm-mfa", protect, confirmMfaCode);
router.post("/request-otp", requestPasswordOtp);
router.post("/reset-password-otp", verifyPasswordOtpAndReset);
router.post("/request-mfa-otp", requestMfaOtp);
router.post("/verify-mfa-otp", verifyMfaOtp);
router.post("/verify-mfa", verifyMfaCode);

module.exports = router;
