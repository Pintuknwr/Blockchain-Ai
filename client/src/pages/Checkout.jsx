export default function Checkout() {
	return (
		<div className="max-w-xl mx-auto px-4 py-8">
			<h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
				Checkout
			</h2>
			<form className="space-y-4">
				<input
					type="text"
					placeholder="Full Name"
					className="w-full p-3 border rounded"
				/>
				<input
					type="text"
					placeholder="Shipping Address"
					className="w-full p-3 border rounded"
				/>
				<input
					type="text"
					placeholder="Card Details"
					className="w-full p-3 border rounded"
				/>
				<button
					type="submit"
					className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700">
					Place Order
				</button>
			</form>
		</div>
	);
}
