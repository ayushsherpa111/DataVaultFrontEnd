import { FormGroup, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ValidateOptions } from "../../custom validators/passOptions";
import { PasswordGeneratorService } from "src/app/Services/passwordGenerator.service";
@Component({
	selector: "app-password-generator",
	templateUrl: "./passwordGenerator.component.html",
	styleUrls: ["./passwordGenerator.component.scss"],
})
export class PasswordGeneratorComponent implements OnInit {
	constructor(
		private fb: FormBuilder,
		private passGen: PasswordGeneratorService
	) {}
	mode: "random" | "CHBS" = "random";
	genPass: string;
	randomWords: FormGroup = this.fb.group({
		length: [8, [Validators.required, Validators.min(8), Validators.max(32)]],
		options: this.fb.group(
			{
				include_uppercase: [true],
				include_lowercase: [true],
				include_numbers: [true],
				include_special: [true],
			},
			{ validators: ValidateOptions }
		),
	});
	CHBS = this.fb.group({
		word_count: [
			4,
			[Validators.required, Validators.min(2), Validators.max(10)],
		],
		min_length: [
			10,
			[Validators.required, Validators.min(10), Validators.max(40)],
		],
		separator: ["-"],
		append_random: [true],
		capitalize: [true],
	});
	ngOnInit() {}
	get length() {
		return this.randomWords.get("length");
	}
	get options() {
		return this.randomWords.get("options");
	}
	get word_length() {
		return this.CHBS.get("word_count");
	}
	get min_length() {
		return this.CHBS.get("min_length");
	}
	generatePassword() {
		if (this.mode === "random") {
			if (this.randomWords.valid) {
				this.genPass = this.passGen.randomPass(
					this.length.value,
					this.options.value.include_lowercase,
					this.options.value.include_uppercase,
					this.options.value.include_special,
					this.options.value.include_numbers
				);
			} else {
			}
		} else {
			if (this.CHBS.valid) {
				this.passGen
					.randomWord(
						this.CHBS.get("word_count").value,
						this.CHBS.get("min_length").value,
						this.CHBS.get("separator").value,
						this.CHBS.get("append_random").value,
						this.CHBS.get("capitalize").value
					)
					.then((pass) => {
						this.genPass = pass;
					})
					.catch((f) => {
						console.error("Press F to pay respects");
					});
			}
		}
	}
	changeMode(mode: "random" | "CHBS") {
		this.mode = mode;
	}
	copyToClipBoard() {
		navigator.clipboard.writeText(this.genPass).then((e) => {
			console.log("Done");
		});
	}
}
