import { StorageService } from "./storage.service";
import { User, format } from "./../interfaces/user";
import { Injectable } from "@angular/core";
import * as cryptoJS from "crypto-js";

@Injectable({
	providedIn: "root"
})
export class KeyGenService {
	private salt: string;
	constructor(private storageService: StorageService) {}

	userAuth() {
		if (typeof Worker !== "undefined") {
			// Create a new
			const worker = new Worker("./key-gen.worker");
			worker.onmessage = ({ data }) => {
				console.log(`page got message: ${data}`);
			};
			worker.postMessage("hello");
		} else {
			// Web Workers are not supported in this environment.
			// You should add a fallback so that your program still executes correctly.
		}
	}

	deriveMasterKey(user: User): Promise<string> {
		console.log("GENNING");
		return new Promise((resolve, reject) => {
			this.salt = cryptoJS.lib.WordArray.random(128 / 8);
			const masterKey = cryptoJS.PBKDF2(
				user.email + user.masterPassword,
				this.salt,
				{
					keySize: 256 / 32,
					iterations: 10000,
					hasher: cryptoJS.algo.SHA512
				}
			);
			resolve(masterKey.toString(cryptoJS.enc.Hex));
		});
	}

	buf2hex(buffer) {
		return Array.prototype.map
			.call(buffer, (x: number) => ("00" + x.toString(16)).slice(-2))
			.join("");
	}

	exportKey(fmt: format, key: CryptoKey) {}
}
