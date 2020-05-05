import levenshtein from "js-levenshtein";
import { DataComponent } from "src/app/interfaces/comp";
import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { enc, lib } from "crypto-js";
import { ElectronService } from "ngx-electron";
import { Subject } from "rxjs";
import { User } from "src/app/interfaces/user";
import { AuthService } from "src/app/Services/auth.service";
import { StorageService } from "src/app/Services/storage.service";
import { MetaData } from "../../icons/meta";
import { v4 } from "uuid";
@Component({
	selector: "app-add-password",
	templateUrl: "./addPassword.component.html",
	styleUrls: ["./addPassword.component.scss"],
})
export class AddPasswordComponent implements OnInit, DataComponent {
	@Output() viewVault = new EventEmitter<number>();
	@Output() addPassword = new EventEmitter();
	@Output() reEnterPrompt = new EventEmitter();
	@Input() hasRenter = false;

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private storage: StorageService,
		private electronService: ElectronService
	) {}
	// reEnterPas = "";
	options = [
		"Social Media",
		"Education",
		"Entertainment",
		"Business",
		"Communication",
		"Shopping",
		"Finance",
		"Other",
	];
	data: User;
	changeSubject = new Subject<number>();
	changeComp = this.changeSubject.asObservable();
	passwordForm: FormGroup = this.fb.group({
		email: ["", [Validators.required, Validators.email]],
		username: ["", [Validators.required]],
		password: ["", [Validators.required]],
		domain: ["", [Validators.required]],
		url: ["", []],
		category: [this.options[0], []],
		description: [],
	});

	assignIcon(category: string, data: string) {
		const categoryItems = MetaData[category];
		const score = { distance: Infinity, icon: "" };
		for (const { meta, icon } of categoryItems) {
			// tslint:disable-next-line: forin
			for (const m of meta) {
				const lScore = levenshtein(data, m);
				if (lScore < score.distance) {
					score.distance = lScore;
					score.icon = icon;
				}
			}
			// console.log(icon);
		}
		return score.icon;
	}

	ngOnInit() {
		console.log(v4());
		this.authService.loginUser.subscribe((u) => {
			this.data = u;
			this.passwordForm.get("email").setValue(this.data.email);
		});
	}

	get password() {
		return this.passwordForm.get("password");
	}
	onSubmit() {
		if (this.passwordForm.valid) {
			const newPass = this.passwordForm.getRawValue();
			newPass.icon = this.assignIcon(
				newPass.category,
				newPass.domain.toLowerCase()
			);
			newPass.id = v4();
			// console.log(newPass);
			if (this.electronService.isElectronApp) {
				this.electronService.ipcRenderer
					.invoke("storePass", newPass)
					.then((data) => {
						if (data) {
							this.addPassword.emit("reInit");
							this.viewVault.emit(2);
						}
					})
					.catch((e) => {
						this.hasRenter = true;
						this.reEnterPrompt.emit({
							boo: true,
							body: newPass,
							type: "add",
						});
					});
				// this.reEnterPrompt = true;
				// this.electronService.ipcRenderer.on("save", (e, data) => {
				// 	console.log("FROM MAIN");
				// 	console.log(data);
				// });
			} else {
				this.hasRenter = true;
				this.reEnterPrompt.emit({ boo: true, body: newPass, type: "add" });
				// this.addPassword.emit(newPass);
				// this.viewVault.emit(2);
			}
		}
	}

	cancel() {
		this.viewVault.emit(2);
	}

	encryptField(value: string) {
		const iv = lib.WordArray.random(128 / 8);
		const key = enc.Hex.parse(this.storage.getItem("masterKey"));
		const encrypted = this.authService.encrypt(value, key, iv);
		return encrypted;
		// console.log(encrypted.toString());
	}
	
}

// const parse = this.authService.formatter.parse(encrypted.toString());
// console.log(parse.iv);
// console.log(this.authService.decrypt(parse, key, parse.iv));
