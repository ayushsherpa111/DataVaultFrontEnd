import { Component, EventEmitter, OnInit, Output, NgZone } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ElectronService } from "ngx-electron";
import { AuthService } from "src/app/Services/auth.service";
import { StorageService } from "src/app/Services/storage.service";
import { HttpService } from "./../../Services/http-service.service";
@Component({
	selector: "app-login-form",
	templateUrl: "./login-form.component.html",
	styleUrls: ["./login-form.component.scss"],
})
export class LoginFormComponent implements OnInit {
	@Output() displayLoading = new EventEmitter();

	loginForm: FormGroup = this.formBuilder.group({
		email: ["", [Validators.required, Validators.email]],
		masterPassword: ["", Validators.required],
	});

	constructor(
		private formBuilder: FormBuilder,
		private http: HttpService,
		private route: Router,
		private authService: AuthService,
		private storage: StorageService,
		private electronService: ElectronService,
		private ngZone: NgZone
	) {
		// 16: word Size, 1 word = 4bytes.
		console.log("Login Page Init");
	}
	data: any;

	get email() {
		return this.loginForm.get("email");
	}

	get password() {
		return this.loginForm.get("masterPassword");
	}

	ngOnInit() {
		this.email.setErrors({ notFound: false });
		this.electronService.ipcRenderer.emit("ping", { from: "REnderer" });
	}

	login() {
		this.displayLoading.emit(true);
		if (this.email.valid && this.password.valid) {
			this.electronService.ipcRenderer.send("userlogin", {
				email: this.email.value,
				authPass: this.password.value,
			});
			this.electronService.ipcRenderer.on("authKeyGen", (event, data) => {
				console.log("FROM RENDER");
				console.log(data);
				this.http
					.login({
						email: this.email.value,
						masterPassword: data,
					})
					.subscribe((e) => {
						if (e.status === 200) {
							this.email.setErrors({ notFound: false });
							this.electronService.ipcRenderer.send("auth", true);
							console.log("Logged in");
							this.storage.storeIn(
								"user",
								JSON.stringify({ email: this.email.value })
							);
							this.displayLoading.emit(false);
							this.authService.loginSubject.next({ email: this.email.value });
							this.ngZone.run(() => {
								this.route.navigate(["home"]);
							});
						} else {
							this.email.setErrors({ notFound: true });
							console.log("LoginFailed");
							this.displayLoading.emit(false);
							this.electronService.ipcRenderer.send("auth", false);
						}
					});
			});
		} else {
			console.log("Invalid passwords");
			this.displayLoading.emit(false);
		}
	}
}
