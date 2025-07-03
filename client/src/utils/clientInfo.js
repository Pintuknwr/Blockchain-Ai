export const getClientInfo = async () => {
	try {
		// Fetch IP via backend proxy to avoid CORS issues
		const ipRes = await fetch("/api/utils/get-ip");
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
		console.error("Failed to get client info", err);
		return {
			ip: "unknown",
			userAgent: navigator.userAgent,
			platform: navigator.platform,
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			timestamp: new Date().toISOString(),
		};
	}
};
