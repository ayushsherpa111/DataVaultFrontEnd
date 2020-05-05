import { Component, OnInit, Input } from "@angular/core";
import { HttpService } from "src/app/Services/http-service.service";

@Component({
	selector: "app-pop-up",
	templateUrl: "./pop-up.component.html",
	styleUrls: ["./pop-up.component.scss"]
})
export class PopUpComponent implements OnInit {
	constructor(private http: HttpService) {}
	@Input() email: string;
	resend = false;
	messageBody: string;
	ngOnInit() {
		console.log("Pop up initialized");
	}
	resendConf() {
		this.http
			.postEndPoint({ email: this.email }, "signup", "resend")
			.subscribe((e: any) => {
				console.log(e);
				this.resend = true;
				this.messageBody = e.msg;
			});
	}
}
