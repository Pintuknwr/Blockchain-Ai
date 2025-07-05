import ProductCard from "../components/ProductCard";

import dummyProducts from "../data/products";

export default function Home() {
	return (
		<div className="bg-gray-50 min-h-screen">
			<div className="max-w-7xl mx-auto px-4 py-6">
				<div className="mb-8">
					<img
						src="../assets/banner.jpg"
						alt="Walmart Deals Banner"
						className="rounded-xl w-full h-64 object-cover"
					/>
				</div>
				<h2 className="text-2xl font-bold mb-4 text-gray-800 ">
					Featured Products
				</h2>
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
					{dummyProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</div>
		</div>
	);
}
