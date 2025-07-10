// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";

import EnableMFA from "./pages/EnableMFA";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RecoverMFA from "./pages/RecoverMFA";
import ForgotPasswordOtp from "./pages/ForgotPasswordOtp";

function App() {
	return (
		<div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/product/:id" element={<ProductDetails />} />
					<Route path="/cart" element={<Cart />} />
					<Route path="/checkout" element={<Checkout />} />
					<Route path="/login" element={<Login />} />
					<Route path="/admin" element={<AdminDashboard />} />
					<Route path="/settings/security" element={<EnableMFA />} />
					<Route path="/recover-mfa" element={<RecoverMFA />} />
					<Route path="/forgot-password" element={<ForgotPasswordOtp />} />
				</Routes>
				<ToastContainer position="top-right" autoClose={2000} />
			</main>
			<Footer />
		</div>
	);
}

export default App;
