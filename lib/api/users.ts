import { studentAccount } from "ecoledirecte-api-types";
import Client from "../client";
import { req, WithRes } from "../util/http";
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
	id: number;
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
	const body: UserRes<id> = await res.json();
	return [body, res];
}

export async function getUserPicture(c: Client, edId: number): Promise<void> {
	const path = `/media/users/${edId}`;
	const res = await req("GET", path, c);
	const body = await res.text();
	console.log(body);
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
	const body: SearchRes = await res.json();
	return [body, res];
}
