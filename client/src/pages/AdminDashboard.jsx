import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminDashboard() {
	const { user, loading: authLoading } = useAuth();
	const [logs, setLogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// 🔐 Redirect non-admin users
	if (!authLoading && (!user || user.role !== "admin")) {
		return <Navigate to="/" />;
	}

	useEffect(() => {
		const fetchLogs = async () => {
			try {
				const token = localStorage.getItem("token");
				const res = await axios.get("/api/transactions/all", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setLogs(res.data);
			} catch (err) {
				console.error("Error fetching logs:", err);
				setError("Failed to load logs");
			} finally {
				setLoading(false);
			}
		};

		if (user?.role === "admin") {
			fetchLogs();
		}
	}, [user]);

	if (authLoading || loading) {
		return <p className="text-center mt-10">Loading Admin Dashboard...</p>;
	}

	return (
		<div className="p-8 max-w-6xl mx-auto">
			<h1 className="text-3xl font-bold mb-6 text-blue-800">Admin Dashboard</h1>

			{error && <p className="text-red-500 mb-4">{error}</p>}

			{logs.length === 0 ? (
				<p className="text-gray-600">No transactions found.</p>
			) : (
				<table className="w-full border rounded overflow-hidden shadow text-sm bg-white">
					<thead className="bg-blue-100 text-blue-900">
						<tr>
							<th className="px-4 py-2 text-left">Tx Hash</th>
							<th className="px-4 py-2 text-left">User</th>
							<th className="px-4 py-2 text-left">Amount</th>
							<th className="px-4 py-2 text-left">Status</th>
							<th className="px-4 py-2 text-left">Reason</th>
							<th className="px-4 py-2 text-left">Block</th>
						</tr>
					</thead>
					<tbody>
						{logs.map((log, idx) => (
							<tr
								key={idx}
								className="border-t hover:bg-gray-50 transition duration-150">
								<td className="px-4 py-2 text-blue-600">{log.txHash}</td>
								<td className="px-4 py-2">{log.user}</td>
								<td className="px-4 py-2">{log.amount}</td>
								<td
									className={`px-4 py-2 font-medium ${
										log.status === "fraud" ? "text-red-600" : "text-green-600"
									}`}>
									{log.status}
								</td>
								<td className="px-4 py-2 text-gray-700">{log.reason}</td>
								<td className="px-4 py-2 text-gray-500">{log.blockNumber}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
