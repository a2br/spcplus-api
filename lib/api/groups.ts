import Client from "../client";
import { parseJSON, req, WithRes } from "../util/http";
import { Res } from "./error";

export type Group = ClassicGroup | InferredGroup;

interface BaseGroup {
	_id: string;
	createdAt: Date;
	name: string;
	description?: string;
	inferred: boolean;
	members: string[];
	class?: Record<string, unknown>;
	char?: string;
}

// Classic group
export interface ClassicGroup extends BaseGroup {
	inferred: false;
}

// Inferred groups
export type InferredGroup = ClassGroup | LevelGroup;

interface BaseInferredGroup extends BaseGroup {
	inferred: true;
	schoolYear: string;
}
// - Classes
export interface ClassGroup extends BaseInferredGroup {
	type: "class";
	schoolYear: string;
	class: {
		edId: number;
		code: string;
		name: string;
	};
}
// - Levels
export interface LevelGroup extends BaseInferredGroup {
	type: "level";
	schoolYear: string;
	char: string;
}

export type GroupsRes = Res<GroupsResSuccess>;
export type GroupRes = Res<GroupResSuccess>;

export type GroupsResSuccess = { groups: Group[] };
export type GroupResSuccess = { group: Group };

export async function getGroups(c: Client): Promise<WithRes<GroupsRes>> {
	const url = "/groups";
	const res = await req("GET", url, c);
	const text = await res.text();
	const body: GroupsRes = parseJSON(text);
	return [body, res];
}

export async function getGroup(
	c: Client,
	id: string
): Promise<WithRes<GroupRes>> {
	const url = `/groups/${id}`;
	const res = await req("GET", url, c);
	const text = await res.text();
	const body: GroupRes = parseJSON(text);
	return [body, res];
}

export type GroupStatsRes = Res<GroupStatsResSuccess>;
export type GroupStatsResSuccess = { leaderboards: LeaderboardsList };

export type LeaderboardsList = { date: Date; leaderboard: Leaderboard }[];
export type Leaderboard = { avg: number; member: string }[];

export async function getGroupStats(
	c: Client,
	id: string
): Promise<WithRes<GroupStatsRes>> {
	const url = `/groups/${id}/stats`;
	const res = await req("GET", url, c);
	const text = await res.text();
	const body: GroupStatsRes = parseJSON(text);
	return [body, res];
}
