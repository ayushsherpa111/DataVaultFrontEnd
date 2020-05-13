import { JwtHelperService } from "@auth0/angular-jwt";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "src/app/interfaces/user";
import { StorageService } from "src/app/Services/storage.service";
import { CompService } from "../comp.service";
import { AuthService } from "./../../Services/auth.service";
import { ElectronService } from "ngx-electron";
@Component({
	selector: "app-home-page",
	templateUrl: "./home-page.component.html",
	styleUrls: ["./home-page.component.scss"],
})
export class HomePageComponent implements OnInit {
	loggedIn: boolean;
	jwt = new JwtHelperService();
	VAULT: any[];
	sortedVault: object;
	contents = this.compGen.components;
	currUser: User;
	msg = "Parent Here";
	childComponent = this.contents[0];
	reEnterPrompt = false;
	reEnterPas = "";
	encBody: any;
	actionType: string;
	constructor(
		private store: StorageService,
		private route: Router,
		private compGen: CompService,
		private authService: AuthService,
		private electronService: ElectronService
	) {}
	sideBar = [
		{
			img: "home.svg",
			load: 0,
			width: "2.6rem",
			click: "load",
		},
		{
			img: "create.png",
			load: 1,
			click: "load",
		},
		{
			img: "safe.png",
			load: 2,
			width: "2.8rem",
			click: "load",
		},
		{
			img: "key.png",
			width: "2.2rem",
			load: 3,
			click: "load",
		},
		{
			img: "cog.png",
			click: "load",
		},
		{
			img: "chart.png",
			width: "2.5rem",
			click: "load",
			load: 5,
		},
		{
			img: "sync.png",
			width: "2.5rem",
			click: "load",
		},
		{
			img: "power.png",
			width: "2.3rem",
			click: "logout",
		},
	];

	rePrompt(val: any) {
		console.log(val);
		this.reEnterPrompt = val.boo;
		this.encBody = val.body;
		this.actionType = val.type;
	}

	logoutUser() {
		this.store.logout();
		if (this.electronService.isElectronApp) {
			this.electronService.ipcRenderer.send("logout");
		}
		this.route.navigate(["login"]);
	}

	ngOnInit() {
		if (!this.store.isLoggedIn()) {
			this.route.navigate(["login"]);
		} else {
			// this.getComponent();
			console.log(this.contents);
			if (this.electronService.isElectronApp) {
				this.initVault();
			} else {
				this.VAULT = [
					{
						id: "6a6ffcee-9f45-4f1d-ba9d-f26994c09058",
						email: "vaforet111@johnderasia.com",
						username: "26ba21931e6bfd57d273970c6d8dc23f",
						password: "26ba21931e6bfd57d273970c6d8dc23f",
						domain: "tumblr",
						url: "https://tumblr.com",
						category: "Social Media",
						description: null,
						icon: "tumblr.png",
						iv: "074c9a1255f9dc9a4cf054f88363a5f4",
						secure: false,
						hash: "123",
						score: 55,
					},
					{
						id: "74207a7a-bb23-43a8-892c-8a20998c8b18",
						email: "vaforet111@johnderasia.com",
						username: "7e61d383bd40b2bda3fcf56906f155c6",
						password: "93ad70d848ede22725e4184ef9ef3609",
						domain: "discrod",
						url: "https://discord.com",
						category: "Communication",
						description: null,
						icon: "discord.png",
						iv: "4f84763e0a89cb240c36299790b39bc4",
						secure: true,
						hash: "123",
						score: 12,
					},
					{
						id: "c6852ec8-f84d-496a-9985-3b08a69a1f1e",
						email: "vaforet111@johnderasia.com",
						username: "366fbee5e838281f95bd1bb15767100d",
						password: "32ffde822958be74618fb2c2ade5654d",
						domain: "paypal",
						url: "https://www.paypal.com",
						category: "Finance",
						description: null,
						icon: "paypal.png",
						iv: "94614bd3ec760ff8794355fbab6197d4",
						secure: true,
						hash: "1234",
						score: 88,
					},
					{
						id: "76d0cab8-3c87-4814-b0b0-de33cd824a8d",
						email: "vaforet111@johnderasia.com",
						username: "170b27bf3532b01bcf7598f872d1f64b",
						password: "cc7d139960edbf103f0a310eddfcbeb6",
						domain: "slack",
						url: "https://slack.com",
						category: "Communication",
						description: null,
						icon: "slack.png",
						iv: "255cdf6dde58e8a718d5a4a8a73c36e9",
						secure: false,
						hash: "12343635",
						score: 90,
					},
					{
						id: "17248c3e-2283-488a-ab81-a3901e274223",
						email: "vaforet111@johnderasia.com",
						username: "6767a5fa03607cba80b0a00fa18d451b",
						password: "8a20e4b9a26389adee4f5f3859c62b9d",
						domain: "drive",
						url: "https://drive.net",
						category: "Business",
						description: null,
						icon: "drive.png",
						iv: "cb6e60e29f1065d81ac99ddbb20bf5ae",
						secure: false,
						hash: "12343635165",
						score: 10,
					},
				];
				this.sortedVault = this.sortVault(this.VAULT);
			}
			this.currUser = this.store.getLoggedInUser();
			if (this.currUser === null) {
				this.logoutUser();
			}
		}
	}

	cancelPrompt() {
		this.reEnterPrompt = false;
		this.encBody = "";
		this.reEnterPas = "";
	}

	redoVault(password) {
		if (password === "reInit") {
			this.initVault();
		} else {
			this.VAULT.push(password);
			this.sortedVault = this.sortVault(this.VAULT);
		}
	}

	sortVault(vault) {
		return vault.reduce((acc, curr) => {
			if (!acc[curr.category]) {
				acc[curr.category] = [];
			}
			acc[curr.category].push(curr);
			return acc;
		}, {});
	}
	loadComponent(index: number) {
		this.childComponent = this.contents[index];
	}
	deletePass(e: string) {
		console.log(this.VAULT);
		if (this.electronService.isElectronApp) {
			this.electronService.ipcRenderer.invoke("delete", e);
		} else {
			const index = this.VAULT.findIndex((pas) => pas.id === e);
			this.VAULT.splice(index, 1);
			this.sortedVault = this.sortVault(this.VAULT);
			console.log(this.VAULT.length);
			console.log(this.VAULT);
		}
	}

	sendToMain() {
		if (this.reEnterPas.length !== 0 || this.reEnterPas !== "") {
			console.log(this.reEnterPas);
			this.electronService.ipcRenderer
				.invoke("refreshKey", this.reEnterPas)
				.then((confirmation) => {
					console.log("CONFROMATION");
					console.log(confirmation);
					if (confirmation) {
						if (this.actionType === "add") {
							return this.electronService.ipcRenderer.invoke(
								"storePass",
								this.encBody
							);
						} else if (this.actionType === "decrypt") {
							return this.electronService.ipcRenderer.invoke(
								"decrypt",
								this.encBody
							);
						} else if (this.actionType === "reload") {
							return this.electronService.ipcRenderer.invoke(
								"loadFileAgain",
								this.encBody
							);
						}
					}
				})
				.then(({ decData, newPass }) => {
					if (this.actionType === "add") {
						this.sortedVault = this.sortVault(decData);
						this.loadComponent(2);
					} else if (this.actionType === "decrypt") {
						console.log("STPRE");
						console.log(decData);
						const payload = {
							body: { ...this.encBody },
							main: { ...decData },
							change: { ...newPass },
						};
						this.store.vaultDecSub.next(payload);
						this.encBody = "";
					} else if (this.actionType === "reload") {
						console.log("reload succesful");
						console.log(decData);
						console.log(newPass);
						this.initVault();
					}
					this.reEnterPas = "";
					this.reEnterPrompt = false;
				})
				.catch((err) => {});
		}
	}
	updateVault() {
		return this.sortedVault;
	}

	initVault() {
		this.VAULT = this.electronService.ipcRenderer.sendSync("fetchVault", "all");
		this.sortedVault = this.sortVault(this.VAULT);
	}
}
