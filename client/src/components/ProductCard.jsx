import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
	return (
		<div className="bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition overflow-hidden">
			<img
				src={product.image}
				alt={product.name}
				className="w-full h-56 object-cover"
			/>
			<div className="p-4">
				<h3 className="font-semibold text-lg text-gray-800 dark:text-white truncate">
					{product.name}
				</h3>
				<p className="text-blue-600 font-bold mt-1">${product.price}</p>
				<Link
					to={`/product/${product.id}`}
					className="inline-block mt-3 text-sm text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
					View Details
				</Link>
			</div>
		</div>
	);
}
