import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ElectronService } from "ngx-electron";
import { StorageService } from "src/app/Services/storage.service";
import { HttpService } from "src/app/Services/http-service.service";
import { HttpResponse } from "@angular/common/http";

@Component({
	selector: "app-vault",
	templateUrl: "./vault.component.html",
	styleUrls: ["./vault.component.scss"],
})
export class VaultComponent implements OnInit {
	@Input() VAULT: any;
	layout: "grid" | "list" = "grid";
	lists: number[];
	eyeCon = true;
	getPass = false;
	currentPass: any;
	message: string;
	copied = false;
	selectPassType = false;
	@Output() delete = new EventEmitter();
	@Output() reEnterPrompt = new EventEmitter();
	@Output() changeComp = new EventEmitter();
	constructor(
		private electron: ElectronService,
		private storageService: StorageService,
		private http: HttpService
	) {
		this.storageService.vaultObservable.subscribe((vault: any) => {
			this.currentPass = { ...vault.body, ...vault.main };
			this.getPass = !this.getPass;
			this.updateVault(vault.body.id, vault.body.category, {
				...vault.body,
				...vault.change,
			});
		});
	}

	copyToClip(data: string) {
		console.log(this.copied);
		const clip = navigator.clipboard;
		clip.writeText(data);
		this.message = "Copied to Clipboard";
		if (!this.copied) {
			this.copied = !this.copied;
			setTimeout(() => {
				this.message = "";
				this.copied = !this.copied;
			}, 1500);
		}
	}

	updateVault(id: string, category: string, newPayload: any) {
		console.log(newPayload);
		if (this.VAULT[category]) {
			this.VAULT[category][
				this.VAULT[category].findIndex((pass) => pass.id === id)
			] = newPayload;
		}
	}

	ngOnInit() {
		console.log("ININT");
		this.changeLayout("grid");
		console.log(this.VAULT);
		// console.log(this.layout);
	}

	changeLayout(layout: "grid" | "list") {
		this.layout = layout;
	}
	deleteEmit(id: string) {
		console.log(id);
		if (this.electron.isElectronApp) {
			this.electron.ipcRenderer
				.invoke("delete", id)
				.then((rep) => {
					console.log(rep);
				})
				.catch((err) => {
					console.error(err);
				});
		} else {
			this.delete.emit(id);
			if (this.getPass) {
				this.getPass = false;
			}
		}
	}

	syncEmit(elem: any) {
		console.log(elem);
		if (this.electron.isElectronApp) {
			this.http.storeVault([elem]).subscribe((e: HttpResponse<any>) => {
				console.log(e.body);
				elem.sync = true;
				this.electron.ipcRenderer
					.invoke("syncVault", elem.id)
					.then((reply) => {
						console.log("Sync chg");
						console.log(reply);
					})
					.catch((err) => {
						console.error(err);
					});
			});
		}
	}

	toggleEye() {
		this.eyeCon = !this.eyeCon;
	}
	goTo(url: string) {
		console.log(this.electron.isElectronApp);
		if (this.electron.isElectronApp) {
			console.log("Elec Open");
			this.electron.ipcRenderer
				.invoke("goTo", url)
				.then((e) => {
					console.log(e);
				})
				.catch((e) => {
					console.log(e);
				});
		} else {
			window.open(url);
		}
	}

	getPasswordDetails(pass) {
		console.log(pass);
		if (this.electron.isElectronApp) {
			this.electron.ipcRenderer
				.invoke("decrypt", pass)
				.then(({ decData, newPass }) => {
					console.log("Desc replied");
					console.log(decData);
					console.log(newPass);
					this.currentPass = { ...pass, ...decData };
					this.updateVault(pass.id, pass.category, {
						...pass,
						...newPass,
					});
					this.getPass = !this.getPass;
				})
				.catch((err) => {
					console.log("GOT THIS");
					this.reEnterPrompt.emit({
						boo: true,
						body: pass,
						type: "decrypt",
					});
				});
		} else {
			this.currentPass = pass;
			this.getPass = !this.getPass;
		}
	}
}
