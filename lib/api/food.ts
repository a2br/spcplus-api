import Client from "../client";
import { req, WithRes } from "../util/http";
import { Res } from "./error";

export async function getMenu(
	c: Client,
	date?: Date
): Promise<WithRes<MenuRes>> {
	const res = await req(
		"GET",
		"/menu" + (date ? `?d=${date.getTime()}` : ""),
		c
	);
	const json: MenuRes = await res.json();
	return [json, res];
}

interface FoodDoc {
	name: string;
	fragments: Array<{
		start: number;
		end: number;
		mealId: string;
	}>;
}

export type Food = FoodDoc | null;

export type Menu = {
	_id: string;
	time: Date;
	weekFrom: Date;
	weekTo: Date;
	supplements: Food;
	days: { name: string; meals: Food[] }[];
};

export type MenuRes = Res<MenuResSuccess>;

export type MenuResSuccess = {
	menu: Menu;
};
