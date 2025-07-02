// pages/ProductDetails.jsx
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

const product = {
	id: 1,
	name: "Sample Product",
	price: 499,
	image: "/assets/product1.jpg",
	description: "This is a great product available at a great price.",
};

export default function ProductDetails() {
	const { id } = useParams();
	const { addToCart } = useCart();

	return (
		<div className="max-w-5xl mx-auto px-4 py-8">
			<div className="grid md:grid-cols-2 gap-8">
				<img
					src={product.image}
					alt={product.name}
					className="w-full h-80 object-contain rounded-lg"
				/>
				<div>
					<h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
						{product.name}
					</h1>
					<p className="text-blue-600 text-xl font-semibold mb-4">
						${product.price}
					</p>
					<p className="text-gray-600 dark:text-gray-300 mb-6">
						{product.description}
					</p>
					<button
						onClick={() => addToCart(product)}
						className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
						Add to Cart
					</button>
				</div>
			</div>
		</div>
	);
}
