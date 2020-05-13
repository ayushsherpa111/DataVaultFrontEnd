import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class ChartService {
	constructor() {}

	vaultTally(vault: any[]): { [key: string]: number[] } {
		const cpy = {};
		for (const cat in vault) {
			if (vault.hasOwnProperty(cat)) {
				cpy[cat] = vault[cat].reduce(
					(acc, curr) => {
						curr.secure ? (acc[0] += 1) : (acc[1] += 1);
						return acc;
					},
					[0, 0]
				);
			}
		}
		return cpy;
	}
	pieTally(vault: any[]): { [key: string]: number } {
		const cpy = JSON.parse(JSON.stringify(vault));
		for (const pass in cpy) {
			if (cpy.hasOwnProperty(pass)) {
				cpy[pass] = cpy[pass].length;
			}
		}
		return cpy;
	}

	overView(vault: any[]) {
		let secure = 0;
		const REUSEDHASH = {};
		let reused = 0;
		for (const pass of vault) {
			if (pass.hash in REUSEDHASH) {
				reused++;
				REUSEDHASH[pass.hash] += 1;
			} else {
				REUSEDHASH[pass.hash] = 1;
			}
			if (pass.secure) {
				secure++;
			}
		}
		return { secure, insecure: vault.length - secure, reused, REUSEDHASH };
	}
}
