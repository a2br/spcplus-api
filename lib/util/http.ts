import Client from "../client";
import { settings } from "./settings";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function req(
	method: Method,
	path: string,
	c: Client,
	body?: Record<string, unknown>
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Response> {
	const url = c.settings.root + path;

	const res = await window.fetch(url, {
		method,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
			"User-Agent": c.settings.userAgent,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any,
	});
	return res;
}
