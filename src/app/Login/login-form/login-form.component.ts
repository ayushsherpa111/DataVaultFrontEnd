import { HttpService } from "./../../Services/http-service.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import * as crypto from "crypto-js";

interface DataValidity {
	valid: boolean;
	err: string;
}

@Component({
	selector: "app-login-form",
	templateUrl: "./login-form.component.html",
	styleUrls: ["./login-form.component.scss"]
})
export class LoginFormComponent implements OnInit {
	emailValid: DataValidity = {
		err: "",
		valid: false
	};
	passValid: DataValidity = {
		err: "",
		valid: false
	};
	loginForm: FormGroup = this.formBuilder.group({
		email: ["", [Validators.required, Validators.email]],
		masterPassword: ["", Validators.required]
	});

	constructor(
		private formBuilder: FormBuilder,
		private httpService: HttpService
	) {
		// 16: word Size, 1 word = 4bytes.
		const txt = crypto.PBKDF2("Message", "secret", {
			hasher: crypto.algo.SHA512,
			keySize: 16,
			iterations: 100
		});
		console.log("hell");
		console.log(txt);
	}

	get isEmailValid(): boolean {
		return this.loginForm.get("email").valid;
	}

	get isPasswordValid(): boolean {
		return this.loginForm.get("masterPassword").valid;
	}

	get email() {
		return this.loginForm.get("email");
	}

	get password() {
		return this.loginForm.get("masterPassword");
	}

	ngOnInit() {
		// this.loginForm.valueChanges
		// 	.pipe(
		// 		map((i) => {
		// 			return {
		// 				email: `Email: ${i.email}`,
		// 				pass: `Password: ${i.masterPassword}`
		// 			};
		// 		}),
		// 		tap((i) => console.log(i))
		// 	)
		// 	.subscribe();
	}
	login() {
		const formValue = this.loginForm.getRawValue();
		this.emailValid.valid = !this.isEmailValid;
		this.passValid.valid = !this.isPasswordValid;
		if (this.email.value === "") {
			this.emailValid.err = "Email is required";
		} else if (!this.email.valid) {
			this.emailValid.err = "Email is invalid";
		}
		if (this.password.value === "") {
			this.passValid.err = "Password is required";
		}

		if (!this.emailValid.valid && !this.passValid.valid) {
			this.httpService.login(formValue);
		} else {
			console.log("WEER");
		}
	}
}
