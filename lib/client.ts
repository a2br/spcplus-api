/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import fetch from "node-fetch";
import { login, logout, refresh } from "./api/auth";
import { settings } from "./util/settings";

export default class Client {
	constructor(public settings: settings) {}

	login(username: string, password: string, save = false) {
		return login(username, password, this, save);
	}
	logout() {
		return logout(this);
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

	async getClubs() {}
}
