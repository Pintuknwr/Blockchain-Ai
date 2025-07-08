import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import products from "../data/products";
import { toast } from "react-toastify";

export default function ProductDetails() {
	const { id } = useParams();
	const { addToCart } = useCart();

	// Find product by id (convert id to number)
	const product = products.find((p) => p.id === parseInt(id));

	if (!product) {
		return (
			<div className="text-center py-20">
				<h2 className="text-2xl text-gray-700">Product not found</h2>
			</div>
		);
	}

	const handleAddToCart = (product) => {
		addToCart(product);
		toast.success("🛒 Item added to cart!", {
			position: "top-right",
			autoClose: 2000,
		});
	};

	return (
		<div className="max-w-5xl mx-auto px-4 py-8">
			<div className="grid md:grid-cols-2 gap-8">
				<img
					src={product.image}
					alt={product.name}
					className="w-full h-80 object-contain rounded-lg"
				/>
				<div>
					<h1 className="text-3xl font-bold text-gray-800 mb-2">
						{product.name}
					</h1>
					<p className="text-blue-600 text-xl font-semibold mb-4">
						${product.price}
					</p>
					<p className="text-gray-600 mb-6">{product.description}</p>
					<button
						onClick={() => handleAddToCart(product)}
						className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
						Add to Cart
					</button>
				</div>
			</div>
		</div>
	);
}
