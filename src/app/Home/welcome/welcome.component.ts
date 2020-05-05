import { Component, OnInit, Input } from "@angular/core";
import { User } from "src/app/interfaces/user";
import { HttpService } from "src/app/Services/http-service.service";
import { environment } from "src/environments/environment";
import { HttpResponse } from "@angular/common/http";

@Component({
	selector: "app-welcome",
	templateUrl: "./welcome.component.html",
	styleUrls: ["./welcome.component.scss"],
})
export class WelcomeComponent implements OnInit {
	@Input() data: User;
	constructor(private http: HttpService) {}

	ngOnInit() {
		// this.data = JSON.parse(this.storage.getItem("user"));
	}
	getSome() {
		this.http
			.postEndPoint([{ password: "BRUH what?" }], "upload", "test")
			.subscribe((res: HttpResponse<any>) => {
				console.log(res.body);
			});
	}
}
