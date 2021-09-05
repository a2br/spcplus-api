import { studentAccount } from "ecoledirecte-api-types";
import Client from "../client";
import { parseJSON, req, WithRes } from "../util/http";
import { Res } from "./error";

export type Self = {
	_id: string;
	createdAt: Date;
	lastSyncedAt: Date;
	edId: number;
	username: string;
	title: string;
	firstName: string;
	lastName: string;
	email: string;
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
	_raw: studentAccount;
};

export type Other = {
	_id: number;
	username: string;
	firstname: string;
	lastname: string;
};

export type UserRes<id extends number | undefined> = undefined extends id
	? SelfRes
	: OtherRes;

export type SelfRes = Res<SelfResSuccess>;
export type OtherRes = Res<OtherResSuccess>;
export type SearchRes = Res<UsersSearchSuccess>;

export type SelfResSuccess = { user: Self };
export type OtherResSuccess = { user: Other };
export type UsersSearchSuccess = { users: Other[] };

export async function getUser<id extends number | undefined>(
	c: Client,
	edId?: id
): Promise<WithRes<UserRes<id>>> {
	const path = `/users/${edId ?? "self"}`;
	const res = await req("GET", path, c);
	const text = await res.text();
	const body: UserRes<id> = parseJSON(text);
	return [body, res];
}

export async function getUserPicture(
	c: Client,
	edId: number
): Promise<Buffer | undefined> {
	const path = `/media/users/${edId}`;
	const res = await req("GET", path, c);
	if (!res.ok) return;
	const arr = await res.arrayBuffer();
	const buffer = Buffer.from(arr);
	return buffer;
}

export async function searchUsers(
	c: Client,
	query: string
): Promise<WithRes<SearchRes>> {
	let path = "/users/search";
	const params = new URLSearchParams();
	params.set("q", query);
	path += "?" + params.toString();
	const res = await req("GET", path, c);
	const text = await res.text();
	const body: SearchRes = parseJSON(text);
	return [body, res];
}
