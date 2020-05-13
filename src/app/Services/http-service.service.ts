import {
	HttpClient,
	HttpHeaders,
	HttpResponse,
	HttpBackend,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { User } from "./../interfaces/user";
import { AuthService } from "./auth.service";
import { StorageService } from "./storage.service";

@Injectable({
	providedIn: "root",
})
export class HttpService {
	authHttp: HttpClient;
	constructor(
		private authService: AuthService,
		private storageService: StorageService,
		private http: HttpClient,
		handler: HttpBackend
	) {
		this.authHttp = new HttpClient(handler);
		console.log(this.authHttp);
	}

	login(user: User) {
		return this.authHttp
			.post(`${environment.serverRoute}/login`, user, { observe: "response" })
			.pipe(
				tap((e) => {
					const accessToken = e.headers.get("X-ACCESS-TOKEN");
					const refToken = e.headers.get("X-REFRESH-TOKEN");
					this.storageService.storeIn("X-ACCESS-TOKEN", accessToken);
					this.storageService.storeIn("X-REFRESH-TOKEN", refToken);
				}),
				catchError((e) => {
					console.log(e.status);
					return of(e);
				})
			);
	}

	register(user: User, header: HttpHeaders) {
		return this.authHttp.post(`${environment.serverRoute}/signup`, user, {
			headers: header,
			responseType: "json",
		});
	}

	postEndPoint(body: object, ...endPoint: string[]) {
		const end = endPoint.join("/");
		return this.http.post(`${environment.serverRoute}/${end}`, body, {
			observe: "response",
		});
	}

	storeVault(body: object) {
		return this.http.post(`${environment.serverRoute}/upload/store`, body, {
			observe: "response",
		});
	}

	getEndPoint(url: string) {
		const httpHeaders = new HttpHeaders({
			"Access-Control-Allow-Origin": "*",
		});
		return this.http.get(`${url}`, {
			headers: httpHeaders,
			responseType: "json",
		});
	}

	getNewAccessToken() {
		const refreshToken = this.storageService.getItem("X-REFRESH-TOKEN");
		return this.http
			.post(
				`${environment.serverRoute}/refresh/`,
				{
					refresh: refreshToken,
				},
				{
					observe: "response",
				}
			)
			.pipe(
				tap((res: HttpResponse<any>) => {
					// console.log(res.headers.keys());
					this.storageService.storeIn(
						"X-ACCESS-TOKEN",
						res.headers.get("x-access-token")
					);
					console.log(res.headers.get("x-access-token"));
				})
			);
	}

	checkEmail(email: string) {
		return this.http.get(
			`${environment.serverRoute}/signup/check?email=${email}`
		);
	}
}
