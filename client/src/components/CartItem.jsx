export default function CartItem({ item, updateQty, removeItem }) {
	return (
		<div className="flex justify-between items-center border-b py-4">
			<div className="flex items-center gap-4">
				<img
					src={item.image}
					alt={item.name}
					className="w-20 h-20 object-contain rounded"
				/>
				<div>
					<h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
					<p className="text-gray-600">
						${item.price} x {item.quantity}
					</p>
				</div>
			</div>
			<div className="flex items-center gap-2">
				<button
					onClick={() => updateQty(item.id, item.quantity - 1)}
					className="px-2 py-1 bg-gray-200 rounded">
					−
				</button>
				<span className="font-semibold">{item.quantity}</span>
				<button
					onClick={() => updateQty(item.id, item.quantity + 1)}
					className="px-2 py-1 bg-gray-200 rounded">
					+
				</button>
				<button
					onClick={() => removeItem(item.id)}
					className="ml-2 text-red-500 hover:underline text-sm">
					Remove
				</button>
			</div>
		</div>
	);
}
