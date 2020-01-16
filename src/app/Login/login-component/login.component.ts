import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  providers: []
})
export class LoginComponent implements OnInit {
  constructor(
    private route: Router
  ) {}

  height: string = window.innerHeight + "px";
  formPosition: string = window.innerWidth - 690 + "px";
  ngOnInit() {
    // this.route.navigate(["/"]);
    console.log("Login Component initialized");
  }
}
