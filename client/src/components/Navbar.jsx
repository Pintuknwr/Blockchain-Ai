// components/Navbar.jsx
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Search } from "lucide-react"; // <-- npm install lucide-react

export default function Navbar() {
	const { cart } = useCart();

	return (
		<nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
				{/* Logo */}
				<Link
					to="/"
					className="text-2xl font-bold tracking-tight hover:text-yellow-300 transition">
					WalmartLite
				</Link>

				{/* Search bar with icon */}
				<div className="flex-1 mx-4 max-w-4xl relative">
					<input
						type="text"
						placeholder="Search everything at Walmart online and in store"
						className="w-full pl-10 pr-4 py-2 rounded-full text-black bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400"
					/>
					<Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
				</div>

				{/* Links & Cart */}
				<div className="flex items-center gap-6 text-sm font-medium">
					<Link to="/cart" className="hover:text-yellow-300 transition">
						🛒 Cart ({cart.length})
					</Link>
					<Link to="/login" className="hover:text-yellow-300 transition">
						🔐 Login
					</Link>
				</div>
			</div>

			{/* Optional: bottom navigation */}
			<div className="bg-blue-700 px-4 py-2 text-sm overflow-x-auto whitespace-nowrap">
				<div className="max-w-7xl mx-auto flex gap-6 text-white font-medium">
					<Link to="#" className="hover:text-yellow-300">
						Departments
					</Link>
					<Link to="#" className="hover:text-yellow-300">
						Deals
					</Link>
					<Link to="#" className="hover:text-yellow-300">
						Pharmacy
					</Link>
					<Link to="#" className="hover:text-yellow-300">
						Auto
					</Link>
					<Link to="#" className="hover:text-yellow-300">
						Electronics
					</Link>
					<Link to="#" className="hover:text-yellow-300">
						Grocery
					</Link>
					<Link to="#" className="hover:text-yellow-300">
						Home
					</Link>
				</div>
			</div>
		</nav>
	);
}
