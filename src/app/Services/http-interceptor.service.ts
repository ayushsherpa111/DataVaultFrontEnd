import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import {
	HttpInterceptor,
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpErrorResponse,
	HttpHeaders,
	HttpResponse,
} from "@angular/common/http";
import { Observable, throwError, Subject } from "rxjs";
import { catchError, tap, switchMap } from "rxjs/operators";
import { StorageService } from "./storage.service";
import { HttpService } from "./http-service.service";

@Injectable({
	providedIn: "root",
})
export class HttpInterceptorService implements HttpInterceptor {
	refereshingAccessToken: boolean;
	acccessTokenRefreshed: Subject<any> = new Subject();

	constructor(
		private storage: StorageService,
		private http: HttpService,
		private route: Router
	) {}
	intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		console.log("REQUESTE GOING OUT");
		req = this.addAccessToken(req);
		return next.handle(req).pipe(
			catchError((err: HttpErrorResponse) => {
				console.log(err.message);
				console.log(err.error);
				console.log(err.headers);
				console.log(err.status);
				if (err.status === 401) {
					// refresh the access token
					return this.refAcessToken().pipe(
						catchError((e) => {
							this.storage.logout();
							console.log("Logging out");
							this.route.navigate(["login"]);
							return throwError("Logout");
						}),
						switchMap(() => {
							console.log("Stiwtching");
							req = this.addAccessToken(req);
							return next.handle(req);
						})
					);
				}
				// return throwError("Something went wrongF");
			})
			// retry(2)
		);
	}

	refAcessToken() {
		if (this.refereshingAccessToken) {
			return new Observable((observer) => {
				this.acccessTokenRefreshed.subscribe(() => {
					observer.next("Token is now being refreshed");
					observer.complete();
				});
			});
		} else {
			this.refereshingAccessToken = true;
			console.log("Refreshing");
			return this.http.getNewAccessToken().pipe(
				catchError((e) => {
					console.log("Something went wrong");
					return throwError("Failed to refresh");
				}),
				tap((e) => {
					console.log(e);
					this.refereshingAccessToken = false;
					console.log("access token refreshed");
					this.acccessTokenRefreshed.next();
				})
			);
		}
	}

	addAccessToken(req: HttpRequest<any>) {
		// const acces = new HttpHeaders({
		// 	"X-ACCESS-TOKEN": this.storage.getItem("X-ACCESS-TOKEN"),
		// 	// "X-REFRESH-TOKEN": this.storage.getItem("X-REFRESH-TOKEN"),
		// });
		req = req.clone({
			headers: req.headers.set(
				"X-ACCESS-TOKEN",
				this.storage.getItem("X-ACCESS-TOKEN")
			),
		});
		return req;
	}
}
