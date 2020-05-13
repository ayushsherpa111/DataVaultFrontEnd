import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "filterVault",
})
export class FilterVaultPipe implements PipeTransform {
	transform(vault: any, secure: boolean): any {
		vault = JSON.parse(vault);
		return vault.filter((pass) => pass.secure === secure).length;
	}
}
