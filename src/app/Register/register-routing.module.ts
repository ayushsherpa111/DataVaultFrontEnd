import { RegisterComponent } from "./register-component/register.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ConfirmLoginComponent } from "./confirm-login/confirm-login.component";

const routes: Routes = [
	{
		path: "",
		component: RegisterComponent
	},
	{
		path: "activate/:token",
		component: ConfirmLoginComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class RegisterRoutingModule {}
