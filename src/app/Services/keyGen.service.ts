import { StorageService } from "./storage.service";
import { User, format } from "./../interfaces/user";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { PBKDF2, algo, enc } from "crypto-js";
@Injectable({
	providedIn: "root"
})
export class KeyGenService {
	private salt: string;
	constructor(private storageService: StorageService) {}

	deriveAuthKey(user: User, masterKey: string) {
		const authPayLoad = masterKey + user.masterPassword;
		const authKey = PBKDF2(authPayLoad, user.salt, {
			keySize: 256 / 32,
			iterations: environment.clientAuthRounds,
			hasher: algo.SHA512
		});
		console.log(`Here is your auth key: ${authKey.toString(enc.Hex)}`);
		return false;
	}

	buf2hex(buffer) {
		return Array.prototype.map
			.call(buffer, (x: number) => ("00" + x.toString(16)).slice(-2))
			.join("");
	}

	exportKey(fmt: format, key: CryptoKey) {}
}
