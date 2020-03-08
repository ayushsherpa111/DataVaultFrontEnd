import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { User } from "./../interfaces/user";
import { AuthService } from "./auth.service";
import { KeyGenService } from "./keyGen.service";

@Injectable({
	providedIn: "root"
})
export class HttpService {
	constructor(
		private authService: AuthService,
		private keyGen: KeyGenService,
		private http: HttpClient
	) {}

	login(user: User) {}

	register(user: User) {
		return this.http.post<User>(`${environment.serverRoute}/signup`, user);
	}

	test1(email: string) {
		return this.http.get(
			`${environment.serverRoute}/signup/check?email=${email}`
		);
	}
}
