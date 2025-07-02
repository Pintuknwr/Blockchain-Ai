import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();

	const [isSignUp, setIsSignUp] = useState(false);
	const [form, setForm] = useState({ email: "", password: "", confirm: "" });
	const [error, setError] = useState("");

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = (e) => {
		e.preventDefault();
		if (isSignUp && form.password !== form.confirm) {
			return setError("Passwords do not match");
		}
		if (!form.email || !form.password) {
			return setError("Email and password are required");
		}

		login(form.email); // mock login
		navigate("/");
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
					{isSignUp ? "Create an Account" : "Sign In to WalmartLite"}
				</h2>

				{error && (
					<div className="text-red-500 text-sm mb-4 text-center">{error}</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="email"
						name="email"
						value={form.email}
						onChange={handleChange}
						placeholder="Email"
						className="w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
						required
					/>
					<input
						type="password"
						name="password"
						value={form.password}
						onChange={handleChange}
						placeholder="Password"
						className="w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
						required
					/>
					{isSignUp && (
						<input
							type="password"
							name="confirm"
							value={form.confirm}
							onChange={handleChange}
							placeholder="Confirm Password"
							className="w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
							required
						/>
					)}

					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
						{isSignUp ? "Sign Up" : "Sign In"}
					</button>
				</form>

				<p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-4">
					{isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
					<button
						onClick={() => {
							setError("");
							setIsSignUp(!isSignUp);
						}}
						className="text-blue-600 hover:underline dark:text-yellow-400">
						{isSignUp ? "Sign In" : "Sign Up"}
					</button>
				</p>
			</div>
		</div>
	);
}
