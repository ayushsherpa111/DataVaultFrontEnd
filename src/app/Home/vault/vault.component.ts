import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ElectronService } from "ngx-electron";
import { StorageService } from "src/app/Services/storage.service";
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
		private storageService: StorageService
	) {
		this.storageService.vaultObservable.subscribe((vault) => {
			this.currentPass = vault;
			this.getPass = !this.getPass;
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
	}
	toggleEye() {
		this.eyeCon = !this.eyeCon;
	}
	goTo(url: string) {
		this.electron.ipcRenderer
			.invoke("goTo", url)
			.then((e) => {
				console.log(e);
			})
			.catch((e) => {
				console.log(e);
			});
	}

	getPasswordDetails(pass) {
		console.log(pass);
		if (this.electron.isElectronApp) {
			this.electron.ipcRenderer
				.invoke("decrypt", pass)
				.then((res) => {
					console.log("Desc replied");
					console.log(res);
					this.currentPass = { ...pass, ...res };
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
	regenPass() {
		this.changeComp.emit(3);
	}
}
