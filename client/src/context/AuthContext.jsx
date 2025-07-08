import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios"; // 👈 Axios instance with baseURL

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// 🔄 Auto-load user if token/session exists
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await axios.get("/user/me");
				setUser(res.data.user || res.data);
			} catch (err) {
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	// 1️⃣ Login Function
	const login = async (email, password, clientInfo = {}) => {
		try {
			const res = await axios.post("/user/login", {
				email,
				password,
				clientInfo,
			});

			if (res.data?.mfaRequired) {
				return {
					mfaRequired: true,
					tempToken: res.data.tempToken,
				};
			}

			setUser(res.data.user);
			return { mfaRequired: false };
		} catch (err) {
			throw new Error(err.response?.data?.message || "Login failed");
		}
	};

	// 2️⃣ MFA Verification
	const verifyMFA = async (tempToken, code) => {
		try {
			const res = await axios.post("/user/verify-mfa", {
				tempToken,
				code,
			});
			setUser(res.data.user);
		} catch (err) {
			throw new Error(err.response?.data?.message || "2FA failed");
		}
	};

	// 3️⃣ Register
	const register = async (email, password, clientInfo = {}) => {
		try {
			const res = await axios.post("/user/register", {
				email,
				password,
				clientInfo,
			});
			setUser(res.data.user);
		} catch (err) {
			throw new Error(err.response?.data?.message || "Registration failed");
		}
	};

	// 🔒 Logout
	const logout = async () => {
		try {
			await axios.post("/user/logout");
		} catch {}
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, verifyMFA, register, logout, loading }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
