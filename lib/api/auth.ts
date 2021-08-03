import Client from "../client";
import { req, WithRes } from "../util/http";
import { Res } from "./error";

export async function login(
	usr: string,
	pwd: string,
	c: Client,
	save = false
): Promise<WithRes<LoginRes>> {
	const res = await req("POST", "/auth/login", c, {
		username: usr,
		password: pwd,
		save: save,
	});
	const json: LoginRes = await res.json();
	return [json, res];
}

type LoginRes = Res<LoginResSuccess>;

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

export async function getTokens(c: Client): Promise<WithRes<TokensRes>> {
	const res = await req("GET", "/auth/tokens", c);
	const json: TokensRes = await res.json();
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
	const json: TokensRes = await res.json();
	return [json, res];
}
