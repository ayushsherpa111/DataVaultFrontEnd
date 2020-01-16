import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";

@Component({
  selector: "app-login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.scss"]
})
export class LoginFormComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) {}

  loginForm: FormGroup = this.formBuilder.group({
    email: ["Eamil.", [Validators.required, Validators.email]],
    masterPassword: ["", Validators.required]
  });
  get email() {
    return this.loginForm.get("email").value;
  }
  ngOnInit() {
    // this.loginForm.valueChanges.subscribe(console.log);
  }
  logEmail() {
    console.log(this.email);
  }
}
