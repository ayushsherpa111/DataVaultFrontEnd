import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomePageComponent } from "./home-page/home-page.component";

const routes: Routes = [
	{
		path: "",
		component: HomePageComponent,
		children: [],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	declarations: [],
})
export class HomeRoutingModule {}
