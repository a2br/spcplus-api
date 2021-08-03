import { studentAccount } from "ecoledirecte-api-types";
import Client from "../client";
import { req, WithRes } from "../util/http";
import { Res } from "./error";

type Self = {
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

type Other = {
	id: number;
	username: string;
	firstname: string;
	lastname: string;
};

type UserRes<id extends number | undefined> = undefined extends id
	? SelfRes
	: OtherRes;

type SelfRes = Res<SelfResSuccess>;
type OtherRes = Res<OtherResSuccess>;
type SearchRes = Res<UsersSearchSuccess>;

type SelfResSuccess = { user: Self };
type OtherResSuccess = { user: Other };
type UsersSearchSuccess = { users: Other[] };

export async function getUser<id extends number | undefined>(
	c: Client,
	edId?: id
): Promise<WithRes<UserRes<id>>> {
	const path = `/users/${edId ?? "self"}`;
	const res = await req("GET", path, c);
	const body: UserRes<id> = await res.json();
	return [body, res];
}

export async function searchUsers(
	c: Client,
	query: string
): Promise<WithRes<SearchRes>> {
	const url = new URL("/users/search");
	url.searchParams.set("q", query);
	const path = url.href;
	const res = await req("GET", path, c);
	const body: SearchRes = await res.json();
	return [body, res];
}
