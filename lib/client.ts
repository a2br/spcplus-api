/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
	delTokens,
	getTokens,
	getUserPicture,
	login,
	logout,
	refresh,
} from "./api";
import { getClubs } from "./api";
import { getMeals, getMenu, rateMeal, StarGrade } from "./api";
import { getSnapshots, takeSnapshot } from "./api";
import { getUser, searchUsers } from "./api";
import { getGroup, getGroups, getGroupStats } from "./api/groups";
import { settings } from "./util";

export default class Client {
	constructor(public settings: settings) {}

	login(username: string, password: string, save = false) {
		return login(username, password, this, save);
	}
	logout() {
		return logout(this);
	}
	getTokens() {
		return getTokens(this);
	}
	delTokens(tokenIds: string[]) {
		return delTokens(this, tokenIds);
	}
	_refreshToken() {
		return refresh(this);
	}

	getUser<id extends number | undefined>(edId?: id) {
		return getUser(this, edId);
	}
	getUserPicture(edId: number) {
		return getUserPicture(this, edId);
	}
	searchUsers(query: string) {
		return searchUsers(this, query);
	}

	async takeSnapshot() {
		return takeSnapshot(this);
	}
	async getSnapshots(limit?: number) {
		return getSnapshots(this, limit);
	}
	async getGroups() {
		return getGroups(this);
	}
	async getGroup(id: string) {
		return getGroup(this, id);
	}
	async getGroupStats(
		id: string,
		periodCode?: string,
		onlyLatest = true,
		trust = true
	) {
		return getGroupStats(this, id, periodCode, onlyLatest, trust);
	}
	// async getInvite() {}

	getMenu(date?: Date) {
		return getMenu(this, date);
	}
	getMeals() {
		return getMeals(this);
	}
	rateMeal(mealId: string, rating: StarGrade | null) {
		return rateMeal(this, mealId, rating);
	}

	getClubs() {
		return getClubs(this);
	}
}
