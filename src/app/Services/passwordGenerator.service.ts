import { Injectable } from "@angular/core";
import { ElectronService } from "ngx-electron";

@Injectable({
	providedIn: "root",
})
export class PasswordGeneratorService {
	constructor(private electron: ElectronService) {}
	lower = "abcdefghijklmnopqrstuvwxyz";
	upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	digits = "0123456789";
	special = " ()`~!@#$%^&*-+=|{}[]:;\"'<>,.?/";
	randomChoice(arr: string | any[]) {
		const rando = Math.floor(Math.random() * arr.length);
		return arr[rando];
	}
	// tslint:disable: variable-name
	randomPass(
		length: number,
		is_lower: boolean,
		is_upper: boolean,
		is_special: boolean,
		is_digits: boolean
	) {
		let pass = "";
		const options = [
			{ text: this.lower, use: is_lower },
			{ text: this.upper, use: is_upper },
			{ text: this.digits, use: is_digits },
			{ text: this.special, use: is_special },
		];
		options.filter((e) => e.use);
		let choice = this.randomChoice(options);
		while (pass.length < length) {
			if (choice.use) {
				pass += this.randomChoice(choice.text);
			}
			choice = this.randomChoice(options);
		}
		return pass;
	}

	async randomWord(
		word_count: number,
		min_length: number,
		separator: string,
		append_random: boolean,
		capitalize: boolean
	): Promise<string> {
		if (this.electron.isElectronApp) {
			try {
				let newPass = await this.electron.ipcRenderer.invoke("CHBS", {
					word_count,
					min_length,
					separator,
					capitalize,
				});
				if (append_random) {
					newPass += Math.floor(Math.random() * 9);
				}
				return newPass;
			} catch (e) {
				console.error(e);
			}
		}
	}
}
