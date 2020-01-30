import { StorageService } from "./storage.service";
import { User } from "./../interfaces/user";
// import { environment } from "./../../environments/environment.prod";
import { environment } from "./../../environments/environment";
import { Injectable } from "@angular/core";
import * as crypto from "crypto-js";

@Injectable({
	providedIn: "root"
})
export class KeyGenService {
	hex = crypto.enc.Hex;
	constructor(private storageService: StorageService) {}

	hashPass(user: User) {
		console.log(user);
		const FINAL_KEY = crypto
			.PBKDF2(user.email + user.masterPassword, environment.salt, {
				hasher: crypto.algo.SHA512,
				keySize: 64,
				iterations: 100000
			})
			.toString(this.hex);
		console.log(FINAL_KEY);
		this.storageService.storeIn("USER_KEY", FINAL_KEY);
		return true;
	}
}
