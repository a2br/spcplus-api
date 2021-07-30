import fetch, { Response } from "node-fetch";
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
	const res = await fetch(url, {
		method,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		body: body as any,
		headers: {
			"User-Agent": c.settings.userAgent,
			...c.settings._addedHeaders,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any,
	});
	return res;
}
