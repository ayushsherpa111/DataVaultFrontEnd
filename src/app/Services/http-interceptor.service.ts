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
import { catchError, tap, switchMap, retry } from "rxjs/operators";
import { StorageService } from "./storage.service";
import { HttpService } from "./http-service.service";

@Injectable({
	providedIn: "root",
})
export class HttpInterceptorService implements HttpInterceptor {
	refereshingAccessToken: boolean;
	acccessTokenRefreshed: Subject<any> = new Subject();

	constructor(private storage: StorageService, private http: HttpService) {}
	intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		console.log("REQUESTE GOING OUT");
		req = this.addAccessToken(req);
		return next.handle(req).pipe(
			catchError((err: HttpErrorResponse) => {
				// console.log(err.headers);
				if (err.status === 401) {
					return this.refAcessToken().pipe(
						switchMap(() => {
							console.log("SWITCHING");
							req = this.addAccessToken(req);
							return next.handle(req);
						}),
						catchError((erro) => {
							console.log("RIP");
							// this.storage.logout();
							return throwError(erro);
						})
					);
				}
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
			return this.http.getNewAccessToken().pipe(
				tap(() => {
					this.refereshingAccessToken = false;
					console.log("access token refreshed");
					this.acccessTokenRefreshed.next();
				})
			);
		}
	}

	addAccessToken(req: HttpRequest<any>) {
		const acces = new HttpHeaders({
			"X-ACCESS-TOKEN": this.storage.getItem("X-ACCESS-TOKEN"),
			// "X-REFRESH-TOKEN": this.storage.getItem("X-REFRESH-TOKEN"),
		});
		req = req.clone({
			headers: acces,
		});
		return req;
	}
}
