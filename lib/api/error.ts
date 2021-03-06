export interface ErrorRes {
	code?: string;
	message?: string;
	origin?: "EcoleDirecte";
}

export type Res<T> = T | ErrorRes;
