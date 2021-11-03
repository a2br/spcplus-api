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

const dateRegex =
	/^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseJSON(str: string): any {
	return JSON.parse(str, (key, val: unknown) => {
		if (typeof val === "string" && dateRegex.test(val)) return new Date(val);
		else return val;
	});
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function purifyObject<T extends object>(obj: T): Purified<T> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const purified: any = Array.isArray(obj) ? [] : {};
	for (const [key, val] of Object.entries(obj)) {
		if (val instanceof Date) purified[key] = val.toISOString();
		else if (val instanceof Buffer) purified[key] = val.toString("base64");
		else if ("toJSON" in val && val.toJSON instanceof Function)
			purified[key] = val.toJSON();
		else if (typeof val === "object" && val !== null)
			purified[key] = purifyObject(val);
		else purified[key] = val;
	}
	return purified;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function removeDates<T extends object>(obj: T): NoDates<T> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const newObj: any = Array.isArray(obj) ? [] : {};
	for (const [key, val] of Object.entries(obj)) {
		if (val instanceof Date) newObj[key] = val.toISOString();
		else if (typeof val === "object" && val !== null)
			newObj[key] = removeDates(val);
		else newObj[key] = val;
	}
	return newObj;
}

/**
 * @description Must be used with a type assertion
 */
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export function reviveDates<T extends object>(obj: T): any {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const newObj: any = Array.isArray(obj) ? [] : {};
	for (const [key, val] of Object.entries(obj)) {
		if (typeof val === "string" && dateRegex.test(val))
			newObj[key] = new Date(val);
		else if (typeof val === "object" && val !== null)
			newObj[key] = reviveDates(val);
		else newObj[key] = val;
	}
	return newObj;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type NoDates<T extends object> = {
	[K in keyof T]: T[K] extends Date
		? string
		: // eslint-disable-next-line @typescript-eslint/ban-types
		T[K] extends object
		? NoDates<T[K]>
		: T[K];
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type Purified<T extends object> = {
	[K in keyof T]: T[K] extends Date | Buffer
		? string
		: // eslint-disable-next-line @typescript-eslint/ban-types
		T[K] extends object
		? Purified<T[K]>
		: T[K];
};
