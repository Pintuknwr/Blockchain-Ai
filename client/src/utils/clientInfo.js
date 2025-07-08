export const getClientInfo = async () => {
	try {
		const ipRes = await fetch("/api/utils/get-ip");

		const contentType = ipRes.headers.get("content-type");
		if (
			!ipRes.ok ||
			!contentType ||
			!contentType.includes("application/json")
		) {
			throw new Error("Not a valid JSON response");
		}

		const { ip } = await ipRes.json();

		const ua = navigator.userAgent;
		const platform = navigator.platform;
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

		return {
			ip,
			userAgent: ua,
			platform,
			timezone,
			timestamp: new Date().toISOString(),
		};
	} catch (err) {
		console.error("❌ Failed to get client info", err.message);
		return {
			ip: "unknown",
			userAgent: navigator.userAgent,
			platform: navigator.platform,
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			timestamp: new Date().toISOString(),
		};
	}
};
