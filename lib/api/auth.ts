import { studentAccount } from "ecoledirecte-api-types";
import Client from "../client";
import { parseJSON, req, WithRes } from "../util/http";
import { Res } from "./error";

export async function login<S extends boolean>(
	usr: string,
	pwd: string,
	c: Client,
	save: S
): Promise<WithRes<S extends true ? LoginRes : LoginValidationRes>> {
	const res = await req("POST", "/auth/login", c, {
		username: usr,
		password: pwd,
		save: save,
	});
	const text = await res.text();
	const json: S extends true ? LoginRes : LoginValidationRes = parseJSON(text);
	return [json, res];
}

export type LoginRes = Res<LoginResSuccess>;
export type LoginValidationRes = Res<LoginValidationResSuccess>;

export type LoginResSuccess = {
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

export type LoginValidationResSuccess = {
	isGood: true;
	response: studentAccount;
};

export function logout(c: Client): Promise<Response> {
	return req("GET", "/auth/logout", c);
}

export function refresh(c: Client): Promise<Response> {
	return req("POST", "/auth/refresh", c);
}

export async function getTokens(c: Client): Promise<WithRes<TokensRes>> {
	const res = await req("GET", "/auth/tokens", c);
	const text = await res.text();
	const json: TokensRes = parseJSON(text);
	return [json, res];
}

export type Token = {
	_id: string;
	iat: Date;
	exp: Date;
	userAgent?: string | undefined;
	lastUsed: Date;
	name: string;
};

export type TokensRes = Res<TokensResSuccess>;

export type TokensResSuccess = {
	tokens: Token[];
};

export async function delTokens(
	c: Client,
	tokenIds: string[]
): Promise<WithRes<TokensRes>> {
	const res = await req("DELETE", "/auth/tokens", c, {
		targets: tokenIds,
	});
	const text = await res.text();
	const json: TokensRes = parseJSON(text);
	return [json, res];
}
