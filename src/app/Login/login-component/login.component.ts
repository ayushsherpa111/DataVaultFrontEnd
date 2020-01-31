import { Component, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { EventEmitter } from "protractor";
@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
	providers: []
})
export class LoginComponent implements OnInit {
	isLoading = false;

	constructor(private route: Router) {}

	height: string = window.innerHeight + "px";
	formPosition: string = window.innerWidth - 690 + "px";
	ngOnInit() {
		console.log("Login Component initialized");
	}

	loading(load: boolean): void {
		console.log("Parent ", load);
		this.isLoading = load;
	}
}
