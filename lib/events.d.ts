/// <reference types="node" />
import { EventEmitter } from "events";

interface LogEvents {
	unauthorized: [];
}

declare class EventsManager extends EventEmitter {
	public on<K extends keyof LogEvents>(
		event: K,
		listener: (...args: LogEvents[K]) => void
	): this;
	public on<S extends string | symbol>(
		event: Exclude<S, keyof LogEvents>,
		listener: (...args: unknown[]) => void
	): this;

	public once<K extends keyof LogEvents>(
		event: K,
		listener: (...args: LogEvents[K]) => void
	): this;
	public once<S extends string | symbol>(
		event: Exclude<S, keyof LogEvents>,
		listener: (...args: unknown[]) => void
	): this;

	public emit<K extends keyof LogEvents>(
		event: K,
		...args: LogEvents[K]
	): boolean;
	public emit<S extends string | symbol>(
		event: Exclude<S, keyof LogEvents>,
		...args: unknown[]
	): boolean;

	public off<K extends keyof LogEvents>(
		event: K,
		listener: (...args: LogEvents[K]) => void
	): this;
	public off<S extends string | symbol>(
		event: Exclude<S, keyof LogEvents>,
		listener: (...args: unknown[]) => void
	): this;

	public removeAllListeners<K extends keyof LogEvents>(event?: K): this;
	public removeAllListeners<S extends string | symbol>(
		event?: Exclude<S, keyof LogEvents>
	): this;
}
declare const logs: EventsManager;
export default logs;
