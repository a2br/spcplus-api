/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { delTokens, getTokens, login, logout, refresh } from "./api/auth";
import { getClubs } from "./api/clubs";
import { settings } from "./util/settings";

//TODO Manage auth cycle by itself
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

	async takeSnapshot() {}
	async getSnapshots() {}
	async getGroup() {}
	async getGroups() {}
	async getInvite() {}

	async getMenu() {}
	async getMenus() {}

	getClubs() {
		return getClubs(this);
	}
}
