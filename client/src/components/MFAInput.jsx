import { useState } from "react";

export default function MFAInput({ onSubmit, loading = false }) {
	const [code, setCode] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!code.trim()) {
			setError("Code is required");
			return;
		}
		setError("");
		onSubmit(code);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 mt-4">
			<input
				type="text"
				value={code}
				onChange={(e) => setCode(e.target.value)}
				placeholder="Enter your 2FA code"
				className="w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
				required
			/>

			{error && <p className="text-sm text-red-500">{error}</p>}

			<button
				type="submit"
				disabled={loading}
				className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50">
				{loading ? "Verifying..." : "Verify Code"}
			</button>
		</form>
	);
}
