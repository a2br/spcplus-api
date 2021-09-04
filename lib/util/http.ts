import Client from "../client";
import events from "../events";

export type WithRes<T> = [body: T, res: Response];

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function req(
	method: Method,
	path: string,
	c: Client,
	body?: Record<string, unknown>,
	refreshed = false
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Response> {
	const url = c.settings.root + path;
	const res = await window.fetch(url, {
		method,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
			"User-Agent": c.settings.userAgent || navigator.userAgent,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any,
		credentials: "include",
	});
	if (
		res.status === 401 &&
		path !== "/auth/login" &&
		path !== "/auth/refresh"
	) {
		if (!refreshed) {
			await c._refreshToken();
			return req(method, path, c, body, true);
		} else {
			// Emit the fact that user is logged out
			events.emit("unauthorized");
		}
	}
	return res;
}
