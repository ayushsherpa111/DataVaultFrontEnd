import { RegisterFormComponent } from "./register-form/register-form.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RegisterRoutingModule } from "./register-routing.module";
import { RegisterComponent } from "./register-component/register.component";

@NgModule({
  declarations: [RegisterComponent, RegisterFormComponent],
  imports: [CommonModule, RegisterRoutingModule]
})
export class RegisterModule {}
