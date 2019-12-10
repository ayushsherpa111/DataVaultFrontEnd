import { FileNotFoundComponent } from "./file-not-found/file-not-found.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./Login/login.module").then(module => module.LoginModule)
  },
  {
    path: "register",
    loadChildren: () =>
      import("./Register/register.module").then(module => module.RegisterModule)
  },
  {
    path: "**",
    component: FileNotFoundComponent,
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
