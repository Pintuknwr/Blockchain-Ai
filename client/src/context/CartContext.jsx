import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
	const [cart, setCart] = useState([]);

	const addToCart = (product) => {
		setCart((prev) => {
			const exists = prev.find((item) => item.id === product.id);
			if (exists) {
				return prev.map((item) =>
					item.id === product.id
						? { ...item, quantity: item.quantity + 1 }
						: item
				);
			}
			return [...prev, { ...product, quantity: 1 }];
		});
	};

	const updateQty = (id, quantity) => {
		if (quantity <= 0) return removeItem(id);
		setCart((prev) =>
			prev.map((item) => (item.id === id ? { ...item, quantity } : item))
		);
	};

	const removeItem = (id) => {
		setCart((prev) => prev.filter((item) => item.id !== id));
	};

	return (
		<CartContext.Provider value={{ cart, addToCart, updateQty, removeItem }}>
			{children}
		</CartContext.Provider>
	);
}

export const useCart = () => useContext(CartContext);
