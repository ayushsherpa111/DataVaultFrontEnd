import { Component, OnInit } from "@angular/core";
import { StorageService } from "src/app/Services/storage.service";
import { Router } from "@angular/router";

@Component({
	selector: "app-home-page",
	templateUrl: "./home-page.component.html",
	styleUrls: ["./home-page.component.scss"]
})
export class HomePageComponent implements OnInit {
	loggedIn: boolean;
	constructor(private store: StorageService, private route: Router) {}

	ngOnInit() {
		if (!this.store.isLoggedIn()) {
			this.route.navigate(["login"]);
		}
	}
}
