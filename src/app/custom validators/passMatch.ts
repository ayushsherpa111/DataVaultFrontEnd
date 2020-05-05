import {
	ValidatorFn,
	FormGroup,
	ValidationErrors,
	AsyncValidatorFn,
	AbstractControl,
} from "@angular/forms";
import { HttpService } from "../Services/http-service.service";
import { Observable, of } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

export const identityRevealedValidator: ValidatorFn = (
	control: FormGroup
): ValidationErrors | null => {
	const masterP = control.get("masterPassword");
	const confP = control.get("confirmPass");

	return confP && masterP && confP.value === masterP.value
		? null
		: { passwordMatchError: true };
};

export function uniqueEmail(http: HttpService): AsyncValidatorFn {
	return (
		ctr: AbstractControl
	): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
		if (ctr.pending) {
			return Promise.resolve({ e: "STill tyyping" });
		}
		return http.checkEmail(ctr.value).pipe(
			tap((e: any) => {
				console.log(e);
			}),
			map((e: any) => {
				if (e && e.err) {
					return { unique: false };
				} else {
					return null;
				}
			}),
			catchError((e) => of(e))
		);
	};
}
