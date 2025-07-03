export default function Footer() {
	return (
		<footer className="bg-[#f3f3f3] bg-gray-300 text-gray-900 pt-10 pb-6 mt-12">
			<div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
				<div>
					<h4 className="font-bold mb-2">Customer Service</h4>
					<ul>
						<li>Help Center</li>
						<li>Returns</li>
						<li>Product Recalls</li>
					</ul>
				</div>
				<div>
					<h4 className="font-bold mb-2">Walmart Services</h4>
					<ul>
						<li>Pharmacy</li>
						<li>Photo Center</li>
						<li>Vision Center</li>
					</ul>
				</div>
				<div>
					<h4 className="font-bold mb-2">Get to Know Us</h4>
					<ul>
						<li>About Us</li>
						<li>Careers</li>
						<li>Newsroom</li>
					</ul>
				</div>
				<div>
					<h4 className="font-bold mb-2">Legal</h4>
					<ul>
						<li>Privacy Policy</li>
						<li>Terms of Use</li>
						<li>California Supply Chains Act</li>
					</ul>
				</div>
			</div>
			<div className="text-center text-xs mt-8 text-gray-800 ">
				&copy; 2025 WalmartLite. All rights reserved.
			</div>
		</footer>
	);
}
