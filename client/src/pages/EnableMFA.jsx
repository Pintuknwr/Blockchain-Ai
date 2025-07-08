import { useState } from "react";
import axios from "../api/axios"; // your axios instance

export default function EnableMFA() {
	const [qrUrl, setQrUrl] = useState(null);
	const [secret, setSecret] = useState("");
	const [code, setCode] = useState("");
	const [confirmed, setConfirmed] = useState(false);
	const [error, setError] = useState("");

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
			<h2 className="text-2xl font-bold mb-4"> Enable MFA (2FA)</h2>
			<h2 className="font-medium text-center">
				Remember the code you enter for future use.
			</h2>
			{confirmed ? (
				<p className="text-green-600 font-medium text-center">
					✅ MFA is now enabled on your account! <br />
					Please remember the code you entered. You'll be asked to enter it each
					time you try to login.
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
