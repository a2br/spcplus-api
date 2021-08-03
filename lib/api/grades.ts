import { gradesResData } from "ecoledirecte-api-types";
import { gradeJson, periodJson, subjectJson } from "ecoledirecte.js";
import Client from "../client";
import { req, WithRes } from "../util/http";
import { Res } from "./error";

type GradeDoc = gradeJson; //& {};

type PeriodDocStats = periodJson & {
	stats: {
		weightedAvg: number | null;
		classAvg: number | null;
	};
	subjects: SubjectDocStats[];
};

type SubjectDocStats = subjectJson & {
	stats: {
		weightedAvg: number | null;
		classAvg: number | null;
	};
};

type Modify<T, R> = Omit<T, keyof R> & R;

export type GradeLite = Omit<GradeDoc, "_raw">;
export type SubjectLite = Omit<SubjectDocStats, "_raw">;
export type PeriodLite = Omit<
	Modify<PeriodDocStats, { subjects: SubjectLite[] }>,
	"_raw"
>;

interface Snapshot {
	firstSeenAt: Date;
	lastSeenAt: Date;
	dates: Date[];
	user: string;

	schoolYear: string;
	grades: Array<GradeLite>;
	periods: Array<PeriodLite>;

	res: gradesResData;

	calcAvg(subjects?: string[]): number | null;
}

export type GradesRes = Res<GradesResSuccess>;
export type GradeRes = Res<GradeResSuccess>;

export type GradesResSuccess = { snapshots: Snapshot[] };
export type GradeResSuccess = { snapshot: Snapshot };

export async function getSnapshots(
	c: Client,
	limit?: number
): Promise<WithRes<GradesRes>> {
	const url = new URL("/path");
	if (limit) url.searchParams.set("limit", limit.toString());
	const path = url.pathname;
	const res = await req("GET", path, c);
	const body: GradesRes = await res.json();
	return [body, res];
}

export async function takeSnapshot(c: Client): Promise<WithRes<GradeRes>> {
	const res = await req("POST", "/grades", c);
	const body: GradeRes = await res.json();
	return [body, res];
}
