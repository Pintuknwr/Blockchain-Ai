import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);

	// 1️⃣ Step 1: Try Login (may return MFA required)
	const login = async (email, password) => {
		try {
			const res = await axios.post("/api/auth/login", {
				email,
				password,
			});

			if (res.data?.mfaRequired) {
				// Step 1 complete, wait for 2FA
				return {
					mfaRequired: true,
					tempToken: res.data.tempToken, // store to verify later
				};
			}

			// Success: No MFA required
			setUser(res.data.user); // or res.data
			localStorage.setItem("token", res.data.token); // optional
			return { mfaRequired: false };
		} catch (err) {
			throw new Error("Login failed");
		}
	};

	// 2️⃣ Step 2: Submit MFA Code
	const verifyMFA = async (tempToken, code) => {
		try {
			const res = await axios.post("/api/auth/verify-2fa", {
				token: tempToken,
				code,
			});

			setUser(res.data.user);
			localStorage.setItem("token", res.data.token); // optional
		} catch (err) {
			throw new Error("2FA failed");
		}
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("token");
	};

	return (
		<AuthContext.Provider value={{ user, login, verifyMFA, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
