import { useState, useEffect } from "react";
import axios from "../api/axios";

export default function ForgotPasswordOtp() {
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [step, setStep] = useState(1);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const [timer, setTimer] = useState(0); // in seconds
	const [resendAvailable, setResendAvailable] = useState(false);

	// Countdown logic
	useEffect(() => {
		if (timer > 0) {
			const interval = setInterval(() => {
				setTimer((prev) => prev - 1);
			}, 1000);
			return () => clearInterval(interval);
		} else {
			setResendAvailable(true);
		}
	}, [timer]);

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60)
			.toString()
			.padStart(2, "0");
		const secs = (seconds % 60).toString().padStart(2, "0");
		return `${mins}:${secs}`;
	};

	const startOtpTimer = () => {
		setTimer(180); // 3 minutes
		setResendAvailable(false);
	};

	const handleRequestOtp = async (e) => {
		e.preventDefault();
		try {
			await axios.post("/user/request-otp", { email });
			setStep(2);
			setMessage("✅ OTP sent to your email.");
			setError("");
			startOtpTimer();
		} catch (err) {
			setError(err.response?.data?.message || "Failed to send OTP.");
			setMessage("");
		}
	};

	const handleResendOtp = async () => {
		try {
			await axios.post("/user/request-otp", { email });
			setMessage("✅ OTP resent to your email.");
			setError("");
			startOtpTimer();
		} catch (err) {
			setError("❌ Failed to resend OTP.");
		}
	};

	const handleResetPassword = async (e) => {
		e.preventDefault();
		try {
			await axios.post("/user/reset-password-otp", {
				email,
				otp,
				newPassword,
			});
			setMessage("✅ Password reset successful. You can now log in.");
			setError("");
		} catch (err) {
			setError(err.response?.data?.message || "Failed to reset password.");
			setMessage("");
		}
	};

	return (
		<div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
			<h2 className="text-2xl font-bold mb-4"> Reset Password with OTP</h2>

			{step === 1 && (
				<form onSubmit={handleRequestOtp}>
					<input
						type="email"
						placeholder="Enter your registered email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="w-full border px-3 py-2 rounded mb-4"
					/>
					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
						Send OTP
					</button>
				</form>
			)}

			{step === 2 && (
				<form onSubmit={handleResetPassword}>
					<input
						type="text"
						placeholder="Enter OTP"
						value={otp}
						onChange={(e) => setOtp(e.target.value)}
						required
						className="w-full border px-3 py-2 rounded mb-3"
					/>
					<input
						type="password"
						placeholder="Enter new password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						required
						className="w-full border px-3 py-2 rounded mb-3"
					/>

					{!resendAvailable && (
						<p className="text-sm text-gray-600 mb-2">
							⏳ OTP expires in:{" "}
							<span className="font-mono">{formatTime(timer)}</span>
						</p>
					)}

					{resendAvailable && (
						<button
							type="button"
							onClick={handleResendOtp}
							className="text-sm text-blue-600 hover:underline mb-2">
							🔁 Resend OTP
						</button>
					)}

					<button
						type="submit"
						className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
						Reset Password
					</button>
				</form>
			)}

			{message && <p className="text-green-600 mt-4 text-center">{message}</p>}
			{error && <p className="text-red-500 mt-4 text-center">{error}</p>}
		</div>
	);
}
