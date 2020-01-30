import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root"
})
export class StorageService {
	constructor() {}

	storeIn(key: string, value: string) {
		localStorage.setItem(key, value);
	}
}
