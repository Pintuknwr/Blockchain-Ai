import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MFAInput from "../components/MFAInput";
import { getClientInfo } from "../utils/clientInfo";

export default function Login() {
	const { login, register, verifyMFA } = useAuth();
	const navigate = useNavigate();

	const [isSignUp, setIsSignUp] = useState(false);
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		confirm: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [mfaStep, setMfaStep] = useState(false);
	const [tempToken, setTempToken] = useState(null);

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!form.email || !form.password) {
			return setError("Email and password are required");
		}

		if (isSignUp) {
			if (!form.name) {
				return setError("Name is required");
			}
			if (form.password !== form.confirm) {
				return setError("Passwords do not match");
			}
		}

		setLoading(true);

		try {
			const clientInfo = await getClientInfo();

			if (isSignUp) {
				await register(form.email, form.password, clientInfo, form.name);
				setIsSignUp(false);
				setForm({
					name: "",
					email: "",
					password: "",
					confirm: "",
				});
				setError("Account created! Please log in.");
			} else {
				const result = await login(form.email, form.password, clientInfo);

				if (result.mfaRequired) {
					setTempToken(result.tempToken);
					setMfaStep(true);
				} else {
					navigate("/");
				}
			}
		} catch (err) {
			setError(err.message || "Authentication failed");
		} finally {
			setLoading(false);
		}
	};

	const handleMfaSubmit = async (code) => {
		setLoading(true);
		setError("");

		try {
			await verifyMFA(tempToken, code);
			navigate("/");
		} catch (err) {
			setError(err.message || "Invalid MFA code");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
			<div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
					{isSignUp
						? "Create an Account"
						: mfaStep
						? "Verify Your Identity"
						: "Sign In to WalmartLite"}
				</h2>

				{error && (
					<div className="text-red-500 text-sm mb-4 text-center">{error}</div>
				)}

				{mfaStep ? (
					<>
						<MFAInput onSubmit={handleMfaSubmit} loading={loading} />
						<p>
							Open your Google Authenticator app and enter the code shown there.
						</p>
						<p
							onClick={() => navigate("/recover-mfa")}
							className="text-sm text-blue-600 hover:underline mt-4 cursor-pointer text-center">
							❓ Can’t access your MFA code?
						</p>
					</>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						{isSignUp && (
							<input
								type="text"
								name="name"
								value={form.name}
								onChange={handleChange}
								placeholder="Full Name"
								className="w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						)}
						<input
							type="email"
							name="email"
							value={form.email}
							onChange={handleChange}
							placeholder="Email"
							className="w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
						<input
							type="password"
							name="password"
							value={form.password}
							onChange={handleChange}
							placeholder="Password"
							className="w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
						{isSignUp && (
							<input
								type="password"
								name="confirm"
								value={form.confirm}
								onChange={handleChange}
								placeholder="Confirm Password"
								className="w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						)}

						<button
							type="submit"
							className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
							disabled={loading}>
							{loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
						</button>

						<p
							onClick={() => navigate("/forgot-password")}
							className="text-sm text-blue-600 hover:underline mt-3 cursor-pointer text-center">
							Forgot Password?
						</p>
					</form>
				)}

				{!mfaStep && (
					<p className="text-sm text-center text-gray-600 mt-4">
						{isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
						<button
							onClick={() => {
								setError("");
								setIsSignUp(!isSignUp);
							}}
							className="text-blue-600 hover:underline">
							{isSignUp ? "Sign In" : "Sign Up"}
						</button>
					</p>
				)}
			</div>
		</div>
	);
}
