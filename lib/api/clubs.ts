import Client from "../client";
import { req, WithRes } from "../util/http";
import { Res } from "./error";

export type Club = {
	createdAt: Date;
	name: string;
	shortName: string;
	description: string;
	shortDescription: string;
	leaders: Person[];
	members: Person[];
	faq: Question[];
	meetings: Meeting[];
	website?: string;
	contact?: string;
	teacher?: string;
	color?: string;
};
type Time = string /* `${Day}${Hour}${Minute}` */;
export type Meeting = [from: Time, to: Time];
type Question = [question: string, answer: string];
export interface Person {
	name: string;
	edId?: number;
}
export type ClubsResSuccess = {
	clubs: Club[];
};
type ClubsRes = Res<ClubsResSuccess>;

export async function getClubs(c: Client): Promise<WithRes<ClubsRes>> {
	const res = await req("GET", "/clubs", c);
	const json: ClubsRes = await res.json();
	return [json, res];
}
