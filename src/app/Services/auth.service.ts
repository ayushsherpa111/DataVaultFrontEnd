import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject } from "rxjs";
import { User } from "../interfaces/user";
import { StorageService } from "./storage.service";
import { enc, lib, AES, mode, pad } from "crypto-js";
@Injectable({
	providedIn: "root",
})
export class AuthService {
	constructor(private storage: StorageService) {}
	loginSubject = new BehaviorSubject<any>(this.loggedUser());
	loginUser = this.loginSubject.asObservable();
	token: string;
	jwt = new JwtHelperService();
	formatter = {
		stringify(cipherParams) {
			const jsonObj: any = { ct: cipherParams.ciphertext.toString(enc.Hex) };
			console.log("BRUHHH");
			if (cipherParams.iv) {
				jsonObj.iv = cipherParams.iv.toString();
			}
			if (cipherParams.salt) {
				jsonObj.s = cipherParams.salt.toString();
			}
			if (cipherParams.key) {
				jsonObj.key = cipherParams.key.toString();
			}
			return JSON.stringify(jsonObj);
		},
		parse(jsonStr) {
			const jsonObj = JSON.parse(jsonStr);
			const cipherParams = (lib as any).CipherParams.create({
				ciphertext: enc.Hex.parse(jsonObj.ct),
				mode: mode.CBC,
				padding: pad.ZeroPadding,
				blockSize: 4,
			});
			if (jsonObj.iv) {
				cipherParams.iv = enc.Hex.parse(jsonObj.iv);
			}
			if (jsonObj.s) {
				cipherParams.s = enc.Hex.parse(jsonObj.s);
			}
			// if (jsonObj.key) {
			// 	cipherParams.key = enc.Hex.parse(jsonObj.key);
			// }
			return cipherParams;
		},
	};

	loggedUser(): User {
		return JSON.parse(this.storage.getItem("user"));
	}

	encrypt(payLoad: string, key: string, iv: any) {
		return AES.encrypt(payLoad, key, {
			mode: mode.CBC,
			iv,
			padding: pad.ZeroPadding,
			format: this.formatter,
		});
	}

	decrypt(payload: any, key: string, iv) {
		return AES.decrypt(payload, key, {
			mode: mode.CBC,
			iv,
			padding: pad.ZeroPadding,
			format: this.formatter,
		}).toString(enc.Utf8);
	}

	getUserToken() {
		this.token = localStorage.getItem("userToken");
	}
}
