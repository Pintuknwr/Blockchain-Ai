import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

export default function EnableMFA() {
	const { user, loading: authLoading } = useAuth(); // add loading flag
	const [qrUrl, setQrUrl] = useState(null);
	const [secret, setSecret] = useState("");
	const [code, setCode] = useState("");
	const [confirmed, setConfirmed] = useState(false);
	const [error, setError] = useState("");

	// If auth is loading, show loading text
	if (authLoading) {
		return <p className="text-center mt-10">Loading...</p>;
	}

	// If user is not logged in
	if (!user) {
		return (
			<p className="text-center text-red-600 mt-10">❌ Please log in first.</p>
		);
	}

	const fetchSecret = async () => {
		try {
			const token = localStorage.getItem("token");

			const res = await axios.get("/user/enable-mfa", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setQrUrl(res.data.qrUrl);
			setSecret(res.data.base32);
			setError("");
		} catch (err) {
			console.error(
				"Failed to generate MFA setup:",
				err.response?.data || err.message
			);
			setError("❌ Failed to generate MFA setup.");
		}
	};

	const confirmCode = async () => {
		try {
			const token = localStorage.getItem("token");

			await axios.post(
				"/user/confirm-mfa",
				{ code, secret },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setConfirmed(true);
			setError("");
		} catch (err) {
			console.error(
				"Failed to confirm MFA code:",
				err.response?.data || err.message
			);
			setError("❌ Invalid code. Please try again.");
		}
	};

	return (
		<div className="p-6 max-w-md mx-auto">
			<h2 className="text-2xl font-bold mb-4">Enable MFA (2FA)</h2>

			{user?.isMfaEnabled ? (
				<p className="text-green-600 font-medium text-center">
					✅ MFA is already enabled for your account.
				</p>
			) : confirmed ? (
				<p className="text-green-600 font-medium text-center">
					✅ MFA is now enabled on your account!
				</p>
			) : (
				<>
					{!qrUrl ? (
						<button
							onClick={fetchSecret}
							className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
							Generate QR Code
						</button>
					) : (
						<>
							<img src={qrUrl} alt="Scan this QR" className="mb-4 mx-auto" />
							<p className="text-sm text-gray-700 mb-2 text-center">
								Scan the QR code using Google Authenticator and enter the
								6-digit code below:
							</p>
							<input
								type="text"
								value={code}
								onChange={(e) => setCode(e.target.value)}
								placeholder="Enter 6-digit code"
								className="w-full border px-3 py-2 rounded mb-2 text-center"
							/>
							<button
								onClick={confirmCode}
								className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">
								Confirm Code
							</button>
						</>
					)}

					{error && (
						<p className="text-red-500 mt-4 text-center font-medium">{error}</p>
					)}
				</>
			)}
		</div>
	);
}
