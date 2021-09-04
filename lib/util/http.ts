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

/**
 *
 * @description Stolen from https://weblog.west-wind.com/posts/2014/jan/06/javascript-json-date-parsing-and-real-dates
 */
// const reISO =
// 	/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
// const reMsAjax = /^\/Date\((d|-|.*)\)[/|\\]$/;
//
// function dateReviver(key: string, value: unknown) {
// 	if (typeof value === "string") {
// 		let a = reISO.exec(value);
// 		if (a) return new Date(value);
// 		a = reMsAjax.exec(value);
// 		if (a) {
// 			const b = a[1].split(/[-+,.]/);
// 			return new Date(b[0] ? +b[0] : 0 - +b[1]);
// 		}
// 	}
// 	return value;
// }

const dateRegex =
	/^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseJSON(str: string): any {
	return JSON.parse(str, (key, val: unknown) => {
		if (typeof val === "string" && dateRegex.test(val)) return new Date(val);
		else return val;
	});
}
