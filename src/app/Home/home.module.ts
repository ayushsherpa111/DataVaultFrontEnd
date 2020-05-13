import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FilterVaultPipe } from "../pipes/filter-vault.pipe";
import { AddPasswordComponent } from "./addPassword/addPassword.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { HomeRoutingModule } from "./home-routing.module";
import { PasswordGeneratorComponent } from "./passwordGenerator/passwordGenerator.component";
import { VaultComponent } from "./vault/vault.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { AnalysisComponent } from "./analysis/analysis.component";

@NgModule({
	declarations: [
		HomePageComponent,
		WelcomeComponent,
		AddPasswordComponent,
		VaultComponent,
		PasswordGeneratorComponent,
		FilterVaultPipe,
		AnalysisComponent,
	],
	imports: [CommonModule, FormsModule, ReactiveFormsModule, HomeRoutingModule],
})
export class HomeModule {}
