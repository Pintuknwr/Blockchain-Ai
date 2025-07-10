// src/pages/Checkout.jsx
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/checkoutForm.jsx";
import axios from "axios";

const stripePromise = loadStripe(
	"pk_test_51Rir2YQWHckvDNPihSBik5iKlstJjKk8j0gF7L1XPQ9Xw8Q8snkZrEjnQBF1wa7VfsJx92Z41XNLGbmvrZ5Lr8nn00sn9YZ4AW"
); // replace with your publishable key

export default function Checkout() {
	const { cart, clearCart } = useCart();
	const { user } = useAuth();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [safeToPay, setSafeToPay] = useState(false);
	const [txId, setTxId] = useState("");
	const [amount, setAmount] = useState(0);

	const subtotal = cart.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);

	// Simulated 30-feature input
	//const features = Array(30).fill(0).map((_, i) => Math.random());
	const features = [
		-1.203, 0.445, 1.243, -0.003, 0.294, -1.125, 0.872, 0.651, -0.427, 1.903,
		-0.377, 0.456, -1.114, 0.11, 0.003, 1.784, -0.765, 0.223, -0.915, 0.778,
		1.056, -0.644, 0.23, 1.342, 0.41, -0.132, 0.755, 0.614, 12.56, 18000.0,
	];

	const handleVerify = async () => {
		setLoading(true);
		setError("");

		try {
			const token = localStorage.getItem("token");

			const res = await axios.post(
				"/api/transactions/checkout",
				{
					features,
					amount: subtotal,
					userId: user?._id || "guest",
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setSafeToPay(true);
			setAmount(subtotal);
			setTxId(res.data.txId);
		} catch (err) {
			console.error(
				"❌ Fraud Check Failed:",
				err.response?.data || err.message
			);
			setError(err.response?.data?.error || "Transaction blocked.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-xl mx-auto px-4 py-8">
			<h2 className="text-2xl font-bold mb-6 text-gray-800">Secure Checkout</h2>

			{error && <p className="text-red-500 mb-4">{error}</p>}
			{success && (
				<p className="text-green-600 font-semibold mb-4">
					✅ Payment successful! TX ID: {txId}
				</p>
			)}

			{!safeToPay ? (
				<>
					<p className="mb-4">🛒 Subtotal: ${subtotal.toFixed(2)}</p>

					<form className="space-y-4">
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
						<button
							type="button"
							onClick={handleVerify}
							className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-50"
							disabled={loading}>
							{loading ? "Verifying..." : "Verify & Continue"}
						</button>
					</form>
				</>
			) : success ? (
				<div className="mt-6 text-center">
					<a
						href="/"
						className="inline-block bg-blue-300 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
						Continue Shopping
					</a>
				</div>
			) : (
				<div className="mt-6">
					<Elements stripe={stripePromise}>
						<CheckoutForm
							amount={amount}
							onSuccess={() => {
								setSuccess(true);
								clearCart();
							}}
						/>
					</Elements>
				</div>
			)}
		</div>
	);
}
