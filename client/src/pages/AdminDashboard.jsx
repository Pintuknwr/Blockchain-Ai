export default function AdminDashboard() {
	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			<h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<div className="bg-white p-6 rounded shadow">
					<h4 className="text-lg font-bold text-blue-600 mb-2">Total Sales</h4>
					<p className="text-2xl font-semibold">$14,000</p>
				</div>
				<div className="bg-white p-6 rounded shadow">
					<h4 className="text-lg font-bold text-blue-600 mb-2">Orders</h4>
					<p className="text-2xl font-semibold">342</p>
				</div>
				<div className="bg-white p-6 rounded shadow">
					<h4 className="text-lg font-bold text-blue-600 mb-2">Inventory</h4>
					<p className="text-2xl font-semibold">125 Items</p>
				</div>
			</div>
		</div>
	);
}
