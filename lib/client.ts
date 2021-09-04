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
import { getMeals, getMenu } from "./api";
import { getSnapshots, takeSnapshot } from "./api";
import { getUser, searchUsers } from "./api";
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

	getUser(edId?: number) {
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
