import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
	const { cart, saved, updateQty, removeItem, saveForLater, moveToCart } =
		useCart();

	const navigate = useNavigate();

	const subtotal = cart.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
				{/* Cart Items Section */}
				<div className="flex-1">
					<h2 className="text-2xl font-bold mb-4 text-gray-800">
						Your Cart ({cart.length} {cart.length === 1 ? "item" : "items"})
					</h2>

					{cart.length === 0 ? (
						<p className="text-gray-600">
							Your cart is empty.{" "}
							<Link to="/" className="text-blue-600 hover:underline">
								Go shopping
							</Link>
							.
						</p>
					) : (
						<div className="space-y-4">
							{cart.map((item) => (
								<CartItem
									key={item.id}
									item={item}
									updateQty={updateQty}
									removeItem={removeItem}
									saveForLater={saveForLater} // ✅ added
								/>
							))}
						</div>
					)}

					{/* Saved for Later Section */}
					{saved.length > 0 && (
						<div className="mt-10">
							<h3 className="text-xl font-semibold mb-4 text-gray-800">
								Saved for Later ({saved.length})
							</h3>
							<div className="space-y-4">
								{saved.map((item) => (
									<div
										key={item.id}
										className="flex items-center justify-between p-4 bg-white rounded shadow">
										<div>
											<p className="font-semibold">{item.name}</p>
											<p className="text-gray-600">${item.price}</p>
										</div>
										<button
											className="text-blue-600 hover:text-blue-900 text-sm"
											onClick={() => moveToCart(item.id)}>
											Move to Cart
										</button>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Checkout Panel */}
				{cart.length > 0 && (
					<div className="w-full md:w-1/3 bg-white shadow-lg rounded-lg p-6 sticky top-20 h-fit">
						<h3 className="text-xl font-semibold mb-4 text-gray-800 ">
							Order Summary
						</h3>
						<div className="space-y-2 text-gray-700">
							<div className="flex justify-between">
								<span>Subtotal</span>
								<span>${subtotal.toFixed(2)}</span>
							</div>
							<div className="flex justify-between">
								<span>Shipping</span>
								<span>Free</span>
							</div>
							<div className="border-t border-gray-300 my-2" />
							<div className="flex justify-between font-bold text-lg">
								<span>Total</span>
								<span>${subtotal.toFixed(2)}</span>
							</div>
						</div>

						<button
							onClick={() => navigate("/checkout")}
							className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition">
							Proceed to Checkout
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
