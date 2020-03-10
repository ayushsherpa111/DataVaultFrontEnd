import { lib } from "crypto-js";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { of } from "rxjs";
import {
	catchError,
	debounceTime,
	distinctUntilChanged,
	map,
	tap
} from "rxjs/operators";
import { identityRevealedValidator } from "src/app/custom validators/passMatch";
import { HttpService } from "src/app/Services/http-service.service";
import { StorageService } from "src/app/Services/storage.service";
import passwordSchema from "../../interfaces/strenght";
import { HttpHeaders, HttpResponse } from "@angular/common/http";
import { worker } from "cluster";
@Component({
	selector: "app-register-form",
	templateUrl: "./register-form.component.html",
	styleUrls: ["./register-form.component.scss"]
})
export class RegisterFormComponent implements OnInit {
	colors = ["#F90000", "#E4C905", "#E17600", "#82E100", "#00E600"];
	passwordScore: passwordSchema = {
		length: 0,
		letters: 0,
		digits: 0,
		splChr: 0
	};
	hasSubmitted = false;
	strengthMeter = "100%";
	strengthColor = "";
	registerForm: FormGroup = this.formBuilder.group(
		{
			email: [
				"",
				[Validators.required, Validators.email]
				// uniqueEmail(this.http)
			],
			masterPassword: ["", [Validators.required, Validators.minLength(8)]],
			confirmPass: ["", Validators.required],
			hint: [""]
		},
		{ validators: identityRevealedValidator }
	);
	fieldType = "password";
	images: string[] = ["open.png", "close.png"];
	eyeCon = this.images[0];
	TOS = false;
	isEmailTaken = true;
	emailMessage = "Email is required";

	constructor(
		private formBuilder: FormBuilder,
		private http: HttpService,
		private storage: StorageService
	) {
		this.registerForm
			.get("email")
			.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
			.subscribe(e => {
				this.isEmailTaken = true;
				if (this.email.valid) {
					this.http
						.test1(e)
						.pipe(
							catchError(err => {
								this.emailMessage = "Email is already in use.";
								return of(err);
							})
						)
						.subscribe((res: any) => {
							console.log(res);
							if (res && res.msg === "valid") {
								this.emailMessage = "GOOD";
								this.isEmailTaken = false;
								this.email.setErrors(null);
							} else if (res && res.err) {
								this.emailMessage = res.err;
								this.isEmailTaken = true;
								this.email.setErrors({ notUnique: true });
							}
						});
				} else {
					this.emailMessage = "Email is invalid";
				}
			});
		this.registerForm
			.get("masterPassword")
			.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
			.subscribe(
				function(pass: string) {
					this.computeStrength.call(this, pass);
					let sum = 0;
					for (const i in this.passwordScore) {
						if (this.passwordScore.hasOwnProperty(i)) {
							sum += this.passwordScore[i];
						}
					}
					this.setPasswordStats(sum);
					console.log(this.passwordScore);
					console.log(pass);
				}.bind(this)
			);
	}

	mapBetn(X: number, A: number, B: number, C: number, D: number): number {
		return ((X - A) / (B - A)) * (D - C) + C;
	}

	ngOnInit() {}

	checkValidation(fieldName: string) {
		const field = this.registerForm.get(fieldName);
		if (fieldName === "confirmPass") {
			if (
				this.registerForm.errors &&
				this.registerForm.errors.passwordMatchError &&
				(field.touched || field.dirty)
			) {
				return true;
			}
		}
		if (field.invalid && (field.touched || field.dirty)) {
			return true;
		} else {
			return false;
		}
	}
	get email() {
		return this.registerForm.get("email");
	}

	setPasswordStats(score: number): void {
		this.strengthMeter = (score * 1.25 > 100 ? 100 : score * 1.25) + "%";
		this.strengthColor = this.colors[
			Math.round(this.mapBetn(score, 0, 90, 0, 4))
		];
	}

	get masterPass() {
		return this.registerForm.get("masterPassword");
	}

	computeStrength(pass: string) {
		if (pass.length === 0) {
			this.passwordScore.length = 0;
			this.passwordScore.digits = 0;
			this.passwordScore.letters = 0;
			this.passwordScore.splChr = 0;
			return;
		}

		if (pass.length <= 4 && pass.length > 0) {
			this.passwordScore.length = 5;
		} else if (pass.length >= 5 && pass.length <= 7) {
			this.passwordScore.length = 10;
		} else {
			this.passwordScore.length = 25;
		}

		// password entropy check
		// letters
		if (/^[a-z]+$/.test(pass) && pass.length > 0 && pass.length) {
			this.passwordScore.letters = 10;
		} else if (/^[a-zA-Z]+/.test(pass) && pass.length > 0 && pass.length) {
			this.passwordScore.letters = 20;
		} else {
			this.passwordScore.letters = 0;
		}

		// digits
		const numCount = pass.match(/\d/g);
		if (numCount === null) {
			this.passwordScore.digits = 0;
		} else if (numCount.length <= 1 && numCount.length > 0) {
			this.passwordScore.digits = 10;
		} else if (numCount.length >= 3) {
			this.passwordScore.digits = 20;
		}

		// special characters
		const spclChrs = pass.match(/\W/g);
		if (spclChrs === null) {
			this.passwordScore.splChr = 0;
		} else if (spclChrs.length === 1) {
			this.passwordScore.splChr = 10;
		} else {
			this.passwordScore.splChr = 25;
		}
	}

	registerUser() {
		this.registerForm.get("hint").clearValidators();
		this.registerForm.markAsUntouched();
		const userData = this.registerForm.getRawValue();
		if (userData.hint === "") {
			delete userData.hint;
		}
		if (this.TOS && this.registerForm.status !== "INVALID") {
			this.hasSubmitted = true;
			delete userData.confirmPass;
			if (typeof Worker !== undefined) {
				const authKeyWorker = new Worker("./auth-key.worker", {
					type: "module"
				});
				authKeyWorker.postMessage(userData.masterPassword + userData.email);
				authKeyWorker.onmessage = e => {
					const userCopy = { ...userData };
					userCopy.masterPassword = e.data;
					console.log(userCopy);
					const header = new HttpHeaders({
						"Content-Type": "application/json"
					});
					this.http
						.register(userCopy, header)
						.pipe(
							catchError(err => {
								return of(err);
							})
						)
						.subscribe(resp => {
							this.hasSubmitted = false;
							console.log(resp);
						});
				};
			}
		} else {
			this.registerForm.markAllAsTouched();
			console.log("Please agree to the TOS");
		}
	}

	revealPassword() {
		if (this.fieldType === "password") {
			this.fieldType = "text";
			this.eyeCon = this.images[1];
		} else {
			this.fieldType = "password";
			this.eyeCon = this.images[0];
		}
	}
}
