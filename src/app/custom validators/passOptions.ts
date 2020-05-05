import { AbstractControl } from "@angular/forms";

export function ValidateOptions(formGroup: AbstractControl) {
	if (
		formGroup.get("include_uppercase").value ||
		formGroup.get("include_lowercase").value ||
		formGroup.get("include_numbers").value ||
		formGroup.get("include_special").value
	) {
		return false;
	} else {
		return { validOptions: true };
	}
}
