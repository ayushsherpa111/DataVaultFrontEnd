import { KeyGenService } from "./keyGen.service";
import { User } from "./../interfaces/user";
import { AuthService } from "./auth.service";
import { Injectable } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
@Injectable({
	providedIn: "root"
})
export class HttpService {
	constructor(
		private authService: AuthService,
		private keyGen: KeyGenService,
		private http: HttpClientModule
	) {}

	login(user: User) {
	}
}
