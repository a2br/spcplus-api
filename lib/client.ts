/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { delTokens, getTokens, login, logout, refresh } from "./api/auth";
import { getClubs } from "./api/clubs";
import { getMeals, getMenu } from "./api/food";
import { getSnapshots, takeSnapshot } from "./api/grades";
import { getUser, searchUsers } from "./api/users";
import { settings } from "./util/settings";
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

	getUser(edId?: number) {
		return getUser(this, edId);
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
	async getGroups() {}
	async getGroup() {}
	async getInvite() {}

	getMenu(date?: Date) {
		return getMenu(this, date);
	}
	getMeals() {
		return getMeals(this);
	}

	getClubs() {
		return getClubs(this);
	}
}
