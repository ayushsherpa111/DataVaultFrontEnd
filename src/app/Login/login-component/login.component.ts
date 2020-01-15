import { Component, OnInit } from "@angular/core";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  constructor() {}
  height: string = window.innerHeight + "px";
  formPosition: string = window.innerWidth - 690 + "px";
  ngOnInit() {
    console.log("Login Component initialized");
  }
}
