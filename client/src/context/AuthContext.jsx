import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			const token = localStorage.getItem("token");

			if (!token) {
				setUser(null);
				setLoading(false);
				return;
			}

			try {
				const res = await axios.get("/user/me", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setUser(res.data.user || res.data);
			} catch (err) {
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

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

			localStorage.setItem("token", res.data.token);
			setUser({
				_id: res.data._id,
				name: res.data.name,
				email: res.data.email,
				role: res.data.role,
			});

			return { mfaRequired: false };
		} catch (err) {
			throw new Error(err.response?.data?.message || "Login failed");
		}
	};

	const verifyMFA = async (tempToken, code) => {
		try {
			const res = await axios.post("/user/verify-mfa", {
				tempToken,
				code,
			});
			localStorage.setItem("token", res.data.token);
			setUser(res.data.user);
		} catch (err) {
			throw new Error(err.response?.data?.message || "2FA failed");
		}
	};

	const register = async (email, password, clientInfo = {}, name = "") => {
		try {
			const res = await axios.post("/user/register", {
				name,
				email,
				password,
				clientInfo,
			});
			localStorage.setItem("token", res.data.token);
			setUser(res.data.user);
		} catch (err) {
			throw new Error(err.response?.data?.message || "Registration failed");
		}
	};

	const logout = async () => {
		try {
			await axios.post("/user/logout");
		} catch {}
		localStorage.removeItem("token");
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{ user, login, verifyMFA, register, logout, loading }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
