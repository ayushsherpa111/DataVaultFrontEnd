import { Observable } from "rxjs";
export class Comp {
	constructor(public comp: any, public data: any) {}
}

export interface DataComponent {
	data: any;
	changeComp: Observable<number>;
}
