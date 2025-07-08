import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RecoverMFA() {
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [step, setStep] = useState(1);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const [timer, setTimer] = useState(0);
	const [resendAvailable, setResendAvailable] = useState(false);

	const { setUser } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (timer > 0) {
			const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
			return () => clearInterval(interval);
		} else {
			setResendAvailable(true);
		}
	}, [timer]);

	const formatTime = (seconds) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(2, "0");
		const s = (seconds % 60).toString().padStart(2, "0");
		return `${m}:${s}`;
	};

	const startTimer = () => {
		setTimer(180); // 3 minutes
		setResendAvailable(false);
	};

	const handleRequestOtp = async (e) => {
		e.preventDefault();
		try {
			await axios.post("/user/request-mfa-otp", { email });
			setStep(2);
			setMessage("✅ OTP sent to your email.");
			setError("");
			startTimer();
		} catch (err) {
			setError(err.response?.data?.message || "Failed to send OTP.");
			setMessage("");
		}
	};

	const handleVerifyOtp = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post("/user/verify-mfa-otp", { email, otp });

			localStorage.setItem("token", res.data.token);
			setUser(res.data.user);
			setMessage("✅ MFA disabled. Logged in successfully.");
			setTimeout(() => navigate("/"), 2000);
		} catch (err) {
			setError(err.response?.data?.message || "OTP verification failed.");
			setMessage("");
		}
	};

	const handleResendOtp = async () => {
		try {
			await axios.post("/user/request-mfa-otp", { email });
			setMessage("✅ OTP resent.");
			setError("");
			startTimer();
		} catch (err) {
			setError("❌ Could not resend OTP.");
		}
	};

	return (
		<div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
			<h2 className="text-2xl font-bold mb-4"> Recover MFA Access</h2>

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
				<form onSubmit={handleVerifyOtp}>
					<input
						type="text"
						placeholder="Enter OTP"
						value={otp}
						onChange={(e) => setOtp(e.target.value)}
						required
						className="w-full border px-3 py-2 rounded mb-3"
					/>

					{!resendAvailable ? (
						<p className="text-sm text-gray-600 mb-2">
							⏳ OTP expires in:{" "}
							<span className="font-mono">{formatTime(timer)}</span>
						</p>
					) : (
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
						Verify & Login
					</button>
				</form>
			)}

			{message && <p className="text-green-600 mt-4 text-center">{message}</p>}
			{error && <p className="text-red-500 mt-4 text-center">{error}</p>}
		</div>
	);
}
