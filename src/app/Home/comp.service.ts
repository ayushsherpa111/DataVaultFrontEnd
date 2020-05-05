import { VaultComponent } from "./vault/vault.component";
import { Injectable } from "@angular/core";
import { WelcomeComponent } from "./welcome/welcome.component";
import { AddPasswordComponent } from "./addPassword/addPassword.component";
import { PasswordGeneratorComponent } from "./passwordGenerator/passwordGenerator.component";

@Injectable({
	providedIn: "root",
})
export class CompService {
	constructor() {}

	get components() {
		return [
			WelcomeComponent,
			AddPasswordComponent,
			VaultComponent,
			PasswordGeneratorComponent,
		];
	}
}
