import Client from "../client";
import { parseJSON, req, WithRes } from "../util/http";
import { Res } from "./error";

export async function getMenu(
	c: Client,
	date?: Date
): Promise<WithRes<MenuRes>> {
	let url = "/menu";
	const params = new URLSearchParams();
	if (date) {
		params.set("d", date.toISOString());
		url += "?" + params.toString();
	}
	const res = await req("GET", url, c);
	const text = await res.text();
	const json: MenuRes = parseJSON(text);
	return [json, res];
}

export interface FoodDoc {
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
	meals: Meal[];
};

export async function getMeals(c: Client): Promise<WithRes<MealsRes>> {
	const url = "/menu/meals";
	const res = await req("GET", url, c);
	const text = await res.text();
	const body: MealsRes = parseJSON(text);
	return [body, res];
}

export type Meal = {
	_id: string;
	name: string;
	aliases: string[];
	ratings: [number, number, number, number, number];
	average: number | null;
	rating: number | null;
};

export type MealsRes = Res<MealsResSuccess>;

export type MealsResSuccess = {
	meals: Meal[];
};
