import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LoginRoutingModule } from "./login-routing.module";
import { LoginComponent } from "./login-component/login.component";
import { LoginFormComponent } from "./login-form/login-form.component";
import { LoadingComponent } from "../ui/loading/loading.component";

@NgModule({
	declarations: [LoginComponent, LoginFormComponent, LoadingComponent],
	imports: [CommonModule, LoginRoutingModule, FormsModule, ReactiveFormsModule]
})
export class LoginModule {}
