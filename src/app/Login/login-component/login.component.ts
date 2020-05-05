import { StorageService } from "./../../Services/storage.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
	providers: [],
})
export class LoginComponent implements OnInit {
	isLoading = false;

	constructor(private route: Router, private store: StorageService) {}

	ngOnInit() {
		if (this.store.isLoggedIn()) {
			this.route.navigate(["home"]);
		}
		console.log("Login Component initialized");
	}

	loading(load: boolean): void {
		console.log("Parent ", load);
		this.isLoading = load;
	}
}
