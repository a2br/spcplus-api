export interface settings {
	root: string;
	userAgent?: string;
	_addedHeaders?: Record<string, unknown>;
}

export class Settings {
	constructor(public settings: settings) {}
	set<K extends keyof settings, V extends settings[K]>(key: K, value: V): void {
		this.settings[key] = value;
	}
	get<K extends keyof settings, V extends settings[K]>(key: K): V {
		return this.settings[key] as V;
	}
}
