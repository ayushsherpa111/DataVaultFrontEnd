import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor() {}
  token: string;
  jwt = new JwtHelperService();

  getUserToken() {
    this.token = localStorage.getItem("userToken");
  }
}
