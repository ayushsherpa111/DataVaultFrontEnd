import { JwtHelperService } from "@auth0/angular-jwt";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class StorageService {
	constructor() {}
	jwt = new JwtHelperService();
	vaultDecSub = new Subject();
	vaultObservable = this.vaultDecSub.asObservable();
	storeIn(key: string, value: string) {
		localStorage.setItem(key, value);
	}
	getItem(key: string) {
		return localStorage.getItem(key);
	}

	logout() {
		localStorage.clear();
	}
	addToVaultLabel(label: string) {
		let vLabel = [];
		if (localStorage.getItem("Vault")) {
			vLabel = JSON.parse(localStorage.getItem("Vault"));
			if (!(label in vLabel)) {
				vLabel.push(label);
			}
		} else {
			vLabel.push(label);
		}
		this.storeIn("Vault", JSON.stringify(vLabel));
	}

	isLoggedIn(): boolean {
		if (this.jwt.isTokenExpired(localStorage.getItem("X-REFRESH-TOKEN"))) {
			return false;
		} else {
			return true;
		}
	}

	getLoggedInUser() {
		const token = this.getItem("X-ACCESS-TOKEN");
		if (token) {
			return this.jwt.decodeToken(token);
		}
		return false;
	}
}
