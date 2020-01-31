export interface User {
	email: string;
	masterPassword: string;
}

export type format = "raw" | "pkcs8" | "spki" | "jwk";
