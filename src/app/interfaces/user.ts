export interface User {
	email: string;
	masterPassword: string;
	[key: string]: string;
}

export type format = "raw" | "pkcs8" | "spki" | "jwk";
