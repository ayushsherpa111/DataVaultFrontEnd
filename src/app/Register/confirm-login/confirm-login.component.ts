import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpService } from "src/app/Services/http-service.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { catchError } from "rxjs/operators";
import { of } from "rxjs";

@Component({
	selector: "app-confirm-login",
	template: `
		<div
			class="regDiv err"
			[style.background-image]="'url(/assets/Images/' + image + ')'"
		>
			<div class="welcome" *ngIf="valid; else elseBlock">
				<h1>Welcome to Data Vault</h1>
				<p>Start protecting your data today.</p>
			</div>
			<ng-template #elseBlock>
				<div class="welcome errD">
					<h1>The token seems to have expired</h1>
					<div
						style="display:flex; align-items:flex-end; flex-direction:column;"
					>
						<p>Request new login Token</p>
						<div class="reqForm">
							<input
								type="text"
								name="email"
								required
								[(ngModel)]="email"
								placeholder="Your Email..."
							/>
							<input
								type="submit"
								class="btn"
								value=""
								(click)="requestNewLoginToken()"
							/>
							<span *ngIf="emailValid">The email is required</span>
						</div>
					</div>
					<p style="font-size: 17px; margin-top: 15px;" *ngIf="requestNewLink">
						We have sent a new login token please check your email
					</p>
				</div>
			</ng-template>
			<div class="proceed" *ngIf="valid">
				Proceed to login
				<img src="/assets/Images/play.png" (click)="goToLogin()" />
			</div>
		</div>
	`,

	styleUrls: ["./confirm-login.component.scss"]
})
export class ConfirmLoginComponent implements OnInit {
	jwt = new JwtHelperService();
	valid: boolean;
	emailValid: boolean;
	email = "";
	postImage = ["abstract-3.png", "error.png"];
	image = "";
	token = "";
	requestNewLink: boolean;
	constructor(
		private actRoute: ActivatedRoute,
		private http: HttpService,
		private route: Router
	) {}
	ngOnInit() {
		this.actRoute.params.subscribe(param => {
			try {
				this.token = param.token;
				if (this.token && !this.jwt.isTokenExpired(this.token)) {
					this.http
						.postEndPoint({ token: this.token }, "signup", "activate")
						.pipe(
							catchError(e => {
								this.valid = false;
								this.image = this.postImage[1];
								return of("Token is invalid");
							})
						)
						.subscribe((e: any) => {
							console.log(e);
							if (e && e.message) {
								this.valid = true;
								this.image = this.postImage[0];
							}
						});
				} else {
					console.log("TOKEN BAD");
					this.valid = false;
					this.image = this.postImage[1];
				}
			} catch (e) {
				this.image = this.postImage[1];
				console.log(e.message);
			}
			// this.http.postEndPoint({ token: param });
		});
	}
	goToLogin() {
		this.route.navigateByUrl("/login").then(e => {
			console.log("Navigating to home");
		});
	}
	requestNewLoginToken() {
		if (this.email && this.email !== "") {
			this.emailValid = false;
			this.http
				.postEndPoint({ email: this.email }, "signup", "resend")
				.subscribe((e: { [key: string]: string | number }) => {
					if (e.stat === 200) {
						this.requestNewLink = true;
					} else {
						this.requestNewLink = false;
					}
					console.log(e);
				});
		} else {
			this.emailValid = true;
		}
	}
}
