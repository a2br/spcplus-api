import fetch from "node-fetch";

export function login(root: string, username: string, password: string) {
	const path = `${root}/auth/login`;
}

interface LoginResponse {}
