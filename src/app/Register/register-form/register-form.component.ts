import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-register-form",
  templateUrl: "./register-form.component.html",
  styleUrls: ["./register-form.component.scss"]
})
export class RegisterFormComponent implements OnInit {
  fieldType = "password";
  images: string[] = ["open.png", "close.png"];
  eyeCon = this.images[0];
  TOS = false;
  constructor() {}

  ngOnInit() {}

  revealPassword() {
    if (this.fieldType === "password") {
      this.fieldType = "text";
      this.eyeCon = this.images[1];
    } else {
      this.fieldType = "password";
      this.eyeCon = this.images[0];
    }
  }
}
