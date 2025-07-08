import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Search, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const descriptions = {
	Departments: "Explore a wide variety of departments...",
	Deals: "Never miss a deal again!",
	Pharmacy: "Manage your prescriptions...",
	Auto: "Shop for all your vehicle needs...",
	Electronics: "Find the latest in electronics...",
	Grocery: "Shop fresh produce, dairy, meats...",
	Home: "From furniture and decor to kitchen appliances...",
};

export default function Navbar() {
	const { cart } = useCart();
	const { user, logout } = useAuth();
	const [activeItem, setActiveItem] = useState(null);

	return (
		<nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
			{/* Top Navbar */}
			<div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
				<Link
					to="/"
					className="text-2xl font-bold tracking-tight hover:text-yellow-300 transition">
					WalmartLite
				</Link>

				<div className="flex-1 mx-4 max-w-4xl relative">
					<input
						type="text"
						placeholder="Search everything at Walmart online and in store"
						className="w-full pl-10 pr-4 py-2 rounded-full text-black bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400"
					/>
					<Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
				</div>

				<div className="flex items-center gap-6 text-sm font-medium">
					<Link to="/cart" className="hover:text-yellow-300 transition">
						🛒 Cart ({cart.length})
					</Link>

					{user ? (
						<div className="flex items-center gap-4">
							<span className="text-sm">👋 {user.name}</span>

							{user.role === "admin" && (
								<Link
									to="/admin"
									className="text-yellow-300 hover:underline font-semibold">
									Admin
								</Link>
							)}

							<button
								onClick={logout}
								className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition">
								Logout
							</button>
						</div>
					) : (
						<Link to="/login" className="hover:text-yellow-300 transition">
							🔐 Login
						</Link>
					)}
				</div>
			</div>

			{/* Bottom Nav */}
			<div className="bg-blue-700 px-4 py-2 text-sm overflow-x-auto whitespace-nowrap relative">
				<div className="max-w-7xl mx-auto flex gap-6 text-white font-medium">
					{Object.keys(descriptions).map((item) => (
						<button
							key={item}
							onClick={() => setActiveItem(item)}
							className="hover:text-yellow-300 focus:outline-none transition">
							{item}
						</button>
					))}
				</div>
			</div>

			{/* Pop-up with Blurred Background */}
			{activeItem && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-md transition-all duration-300">
					<div className="bg-white text-black rounded-xl max-w-lg w-full mx-4 p-6 relative shadow-lg animate-fadeIn pointer-events-auto">
						<button
							onClick={() => setActiveItem(null)}
							className="absolute top-3 right-3 text-gray-600 hover:text-red-500">
							<X size={22} />
						</button>
						<h2 className="text-2xl font-semibold mb-3 text-blue-900">
							{activeItem}
						</h2>
						<p className="text-gray-900 leading-relaxed text-sm">
							{descriptions[activeItem]}
						</p>
					</div>
				</div>
			)}
		</nav>
	);
}
