// src/pages/Checkout.jsx
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Checkout() {
	const { cart } = useCart();
	const { user } = useAuth();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const subtotal = cart.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const token = localStorage.getItem("token");

			if (!token) {
				setError("You're not logged in.");
				setLoading(false);
				return;
			}

			console.log("📦 Sending transaction log:", {
				user: user?._id,
				amount: subtotal,
				status: "success",
				reason: "normal",
			});

			await axios.post(
				"/api/transactions/log",
				{
					user: user?._id || "guest",
					amount: subtotal,
					status: "success",
					reason: "normal", // or "fraud" if ML flags it in future
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setSuccess(true);
			setTimeout(() => navigate("/"), 2000); // redirect after 2s
		} catch (err) {
			console.error("❌ Axios Error:", err.response?.data || err.message);
			setError("Transaction failed. Try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-xl mx-auto px-4 py-8">
			<h2 className="text-2xl font-bold mb-6 text-gray-800 ">Checkout</h2>

			{success && (
				<p className="text-green-600 font-semibold mb-4">
					✅ Order placed and logged to blockchain!
				</p>
			)}

			{error && <p className="text-red-500 mb-4">{error}</p>}

			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					type="text"
					placeholder="Full Name"
					className="w-full p-3 border rounded"
					required
				/>
				<input
					type="text"
					placeholder="Shipping Address"
					className="w-full p-3 border rounded"
					required
				/>
				<input
					type="text"
					placeholder="Card Details"
					className="w-full p-3 border rounded"
					required
				/>

				<button
					type="submit"
					className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-50"
					disabled={loading}>
					{loading ? "Processing..." : "Place Order"}
				</button>
			</form>
		</div>
	);
}
