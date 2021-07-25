import fetch from "node-fetch";

export default class Client {
	constructor(public username: string, public password: string) {}

	async login() {}
	async takeSnapshot() {}
	async getSnapshots() {}
	async getClubs() {}
	async getMenu() {}
	async getMenus() {}
	async getGroup() {}
	async getGroups() {}
	async getInvite() {}
	async logout() {}
}
