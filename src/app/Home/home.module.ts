import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomeRoutingModule } from "./home-routing.module";
import { HomePageComponent } from "./home-page/home-page.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { AddPasswordComponent } from "./addPassword/addPassword.component";
import { VaultComponent } from "./vault/vault.component";
import { PasswordGeneratorComponent } from "./passwordGenerator/passwordGenerator.component";

@NgModule({
	declarations: [
		HomePageComponent,
		WelcomeComponent,
		AddPasswordComponent,
		VaultComponent,
		PasswordGeneratorComponent,
	],
	imports: [CommonModule, FormsModule, ReactiveFormsModule, HomeRoutingModule],
	// entryComponents: [WelcomeComponent, AddPasswordComponent, VaultComponent],
})
export class HomeModule {}
