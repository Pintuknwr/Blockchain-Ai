const express = require("express");
const {
	registerUser,
	loginUser,
	getMe,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/me", protect, getMe);

module.exports = router;
