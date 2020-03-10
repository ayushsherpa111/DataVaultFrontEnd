import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root"
})
export class StorageService {
	constructor() {}

	storeIn(key: string, value: string) {
		localStorage.setItem(key, value);
	}

	isLoggedIn(): boolean {
		if (localStorage.getItem("X-ACCESS-TOKEN") === null) {
			return false;
		} else {
			return true;
		}
	}
}
