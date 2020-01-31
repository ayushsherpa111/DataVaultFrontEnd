import { KeyGenService } from "./keyGen.service";
import { User } from "./../interfaces/user";
import { AuthService } from "./auth.service";
import { Injectable } from "@angular/core";
@Injectable({
	providedIn: "root"
})
export class HttpService {
	constructor(
		private authService: AuthService,
		private keyGen: KeyGenService
	) {}

	login(user: User) {
		console.log("Key Saved", user);
		return this.keyGen.deriveMasterKey(user);
	}
}
