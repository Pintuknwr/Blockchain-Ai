import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const CheckoutForm = ({ amount, onSuccess }) => {
	const stripe = useStripe();
	const elements = useElements();

	const [processing, setProcessing] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setProcessing(true);
		setError("");

		try {
			const { data } = await axios.post("/api/payment/create-payment-intent", {
				amount,
			});

			const result = await stripe.confirmCardPayment(data.clientSecret, {
				payment_method: {
					card: elements.getElement(CardElement),
				},
			});

			if (result.error) {
				console.error("❌ Stripe Payment Error:", result.error.message);
				setError(result.error.message);
			} else if (result.paymentIntent.status === "succeeded") {
				console.log("✅ Payment succeeded:", result.paymentIntent.id);

				try {
					const token = localStorage.getItem("token");
					const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

					await axios.post(
						"/api/payment/save-order",
						{
							items: cartItems,
							totalAmount: amount,
							paymentIntentId: result.paymentIntent.id,
						},
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					);

					localStorage.removeItem("cartItems");
					localStorage.removeItem("totalAmount");

					onSuccess();
				} catch (err) {
					console.error("❌ Failed to save order:", err);
					setError("Payment successful, but saving order failed.");
				}
			}
		} catch (err) {
			console.error("❌ Payment Intent Error:", err.message);
			setError("Payment failed. Please try again.");
		} finally {
			setProcessing(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-4 max-w-md mx-auto p-4 border rounded shadow">
			<CardElement
				options={{
					style: {
						base: {
							fontSize: "16px",
							color: "#32325d",
							"::placeholder": {
								color: "#a0aec0",
							},
						},
						invalid: {
							color: "#e53e3e",
						},
					},
				}}
			/>

			{error && <p className="text-red-500 text-sm">{error}</p>}

			<button
				type="submit"
				disabled={!stripe || processing}
				className="w-full py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 disabled:opacity-50">
				{processing ? "Processing..." : `Pay $${amount}`}
			</button>
		</form>
	);
};

export default CheckoutForm;
