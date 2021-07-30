import { Response } from "node-fetch";
import Client from "../client";
import { req } from "../util/http";
import { ErrorRes } from "./error";

export async function login(
	usr: string,
	pwd: string,
	c: Client,
	save = false
): Promise<[body: LoginResponse, res: Response]> {
	const res = await req("POST", "/auth/login", c, {
		username: usr,
		password: pwd,
		save: save,
	});
	const json: LoginResponse = await res.json();
	return [json, res];
}

type LoginResponse = LoginResSuccess | ErrorRes;

type LoginResSuccess = {
	welcome: boolean | undefined;
	refreshToken: string;
	accessToken: string;
	data: {
		_id: string;
		createdAt: Date;
		lastSyncedAt: Date;
		edId: number;
		username: string;
		firstName: string;
		lastName: string;
		schoolYear: string;
		cafeteria: {
			monday: boolean;
			tuesday: boolean;
			wednesday: boolean;
			thursday: boolean;
			friday: boolean;
		};
		photo: string;
		class?: number;
	};
};

export function logout(c: Client) {
	return req("GET", "/auth/logout", c);
}

export function refresh(c: Client) {
	return req("POST", "/auth/refresh", c);
}
