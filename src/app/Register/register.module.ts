import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RegisterFormComponent } from "./register-form/register-form.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RegisterRoutingModule } from "./register-routing.module";
import { RegisterComponent } from "./register-component/register.component";
import { HttpClientModule } from "@angular/common/http";
import { UniqueEmailDirective } from "../custom validators/uniqueEmail.directive";
import { PopUpComponent } from "./pop-up/pop-up.component";

@NgModule({
	declarations: [
		RegisterComponent,
		RegisterFormComponent,
		UniqueEmailDirective,
		PopUpComponent
	],
	imports: [
		CommonModule,
		RegisterRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule
	]
})
export class RegisterModule {}
