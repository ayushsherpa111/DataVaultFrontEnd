import { User } from "./../../interfaces/user";
import { HttpService } from "./../../Services/http-service.service";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { KeyGenService } from "src/app/Services/keyGen.service";

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
	@Output() displayLoading = new EventEmitter();

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
		private keyGenService: KeyGenService
	) {
		// 16: word Size, 1 word = 4bytes.
		console.log("hell");
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

	ngOnInit() {}

	validateLoginData() {
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
	}

	login() {
		this.displayLoading.emit(true);
		const formValue = this.loginForm.getRawValue();
		this.validateLoginData();
		if (!this.emailValid.valid && !this.passValid.valid) {
			if (typeof Worker !== "undefined") {
				const worker = new Worker("./key-gen.worker", { type: "module" });
				worker.postMessage(formValue);
				worker.onmessage = ({ data }) => {
					formValue.salt = data.salt;
					const masterKey = data.masterKey;
					console.log(masterKey);
					// this.keyGenService.deriveAuthKey(formValue, masterKey)
					this.displayLoading.emit(false);
				};
			} else {
				console.log("object");
			}
		} else {
			console.log("ERR");
			this.displayLoading.emit(false);
		}
	}
}
