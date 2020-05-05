import { Directive } from "@angular/core";
import {
	AsyncValidator,
	AbstractControl,
	ValidationErrors,
	NG_ASYNC_VALIDATORS
} from "@angular/forms";
import { Observable } from "rxjs";
import { HttpService } from "../Services/http-service.service";
import { map, debounceTime } from "rxjs/operators";

@Directive({
	selector: "[appUniqueEmail]",
	providers: [
		{
			provide: NG_ASYNC_VALIDATORS,
			useExisting: UniqueEmailDirective,
			multi: true
		}
	]
})
export class UniqueEmailDirective implements AsyncValidator {
	validate(
		control: AbstractControl
	): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
		console.log(control);
		return this.http.checkEmail(control.value).pipe(
			debounceTime(500),
			map((e: any) => (e.email && e.email.length > 0 ? null : { e: "pass" }))
		);
	}
	constructor(private http: HttpService) {}
}
