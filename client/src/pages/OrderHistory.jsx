import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderHistory = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchOrders = async () => {
		try {
			const token = localStorage.getItem("token");
			const res = await axios.get("/api/orders/user", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setOrders(res.data);
		} catch (err) {
			console.error("Failed to fetch orders", err);
		} finally {
			setLoading(false);
		}
	};

	const downloadInvoice = async (orderId) => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.get(`/api/orders/${orderId}/invoice`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				responseType: "blob", // Get raw PDF data
			});

			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `invoice-${orderId}.pdf`);
			document.body.appendChild(link);
			link.click();
			link.remove();
		} catch (err) {
			console.error("Failed to download invoice", err);
			alert("Invoice download failed");
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-4">My Order History</h1>
			{loading ? (
				<p>Loading...</p>
			) : orders.length === 0 ? (
				<p>No orders found.</p>
			) : (
				<div className="space-y-6">
					{orders.map((order) => (
						<div key={order._id} className="p-4 border rounded shadow">
							<p>
								<strong>Order ID:</strong> {order._id}
							</p>
							<p>
								<strong>Date:</strong>{" "}
								{new Date(order.createdAt).toLocaleString()}
							</p>
							<p>
								<strong>Total:</strong> ${order.totalAmount.toFixed(2)}
							</p>
							<p>
								<strong>Status:</strong> {order.paymentStatus}
							</p>

							<ul className="mt-2 pl-4 list-disc text-sm">
								{order.items.map((item, index) => (
									<li key={index}>
										{item.name} × {item.quantity} — ${item.price}
									</li>
								))}
							</ul>

							<button
								onClick={() => downloadInvoice(order._id)}
								className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
								Download Invoice
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default OrderHistory;
