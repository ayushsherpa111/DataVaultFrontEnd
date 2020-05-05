import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class StorageService {
	constructor() {}
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

	encryptData(data: string) {}

	isLoggedIn(): boolean {
		if (localStorage.getItem("X-ACCESS-TOKEN") === null) {
			return false;
		} else {
			return true;
		}
	}
}
