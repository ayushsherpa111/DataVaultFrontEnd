import { ElectronService } from "ngx-electron";
import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { User } from "src/app/interfaces/user";

@Component({
	selector: "app-welcome",
	templateUrl: "./welcome.component.html",
	styleUrls: ["./welcome.component.scss"],
})
export class WelcomeComponent implements OnInit {
	@Input() data: User;
	@Input() VAULT: any;
	@Output() reEnterPrompt = new EventEmitter();
	@Output() viewVault = new EventEmitter<number>();
	constructor(private electron: ElectronService) {}

	ngOnInit() {
		console.log(this.VAULT);
	}

	openFile(type: "json" | "csv") {
		if (this.electron.isElectronApp) {
			this.electron.ipcRenderer
				.invoke("loadFile", type)
				.then((reply) => {
					if (!reply.status) {
						this.reEnterPrompt.emit({
							boo: true,
							body: reply.path,
							type: "reload",
						});
					} else {
						console.log("File Imported");
						console.log(reply);
						this.viewVault.emit(2);
					}
				})
				.catch((err) => {
					console.error(err);
				});
		} else {
		}
	}

	csvTest() {
		this.electron.ipcRenderer.invoke("testCSV").then((e) => {
			console.log(e);
		});
	}
}
