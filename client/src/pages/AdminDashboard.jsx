// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
	const [logs, setLogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

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
				setError("Failed to fetch logs");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchLogs();
	}, []);

	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			<h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>

			{loading ? (
				<p>Loading transactions...</p>
			) : error ? (
				<p className="text-red-500">{error}</p>
			) : (
				<table className="min-w-full bg-white rounded shadow overflow-hidden">
					<thead>
						<tr className="bg-blue-600 text-white text-left text-sm">
							<th className="p-3">Tx ID</th>
							<th className="p-3">Fraud?</th>
							<th className="p-3">Block</th>
							<th className="p-3">Tx Hash</th>
						</tr>
					</thead>
					<tbody>
						{logs.map((log, idx) => (
							<tr key={idx} className="border-t text-sm text-gray-800">
								<td className="p-3">{log.txId}</td>
								<td className="p-3">
									{log.isFraud ? (
										<span className="text-red-600 font-semibold">Yes</span>
									) : (
										"No"
									)}
								</td>
								<td className="p-3">{log.blockNumber}</td>
								<td className="p-3 truncate max-w-xs">{log.txHash}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
