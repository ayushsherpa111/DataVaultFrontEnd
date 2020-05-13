import { map } from "rxjs/operators";
import { ChartService } from "./../../Services/chart.service";
import { StorageService } from "./../../Services/storage.service";
import { Component, OnInit, Input } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Chart } from "chart.js";
@Component({
	selector: "app-analysis",
	templateUrl: "./analysis.component.html",
	styleUrls: ["./analysis.component.scss"],
	providers: [JwtHelperService],
})
export class AnalysisComponent implements OnInit {
	constructor(
		private storage: StorageService,
		private chartService: ChartService
	) {}
	barChart: Chart;
	pieChart: Chart;
	currentUser: string;
	jwt = new JwtHelperService();
	tally: { [key: string]: number[] };
	pieTally: { [key: string]: number };
	overView: any;
	health: number;
	selected: "total" | "safe" | "unsafe" | "reuse" = "total";
	battery = {
		unsafe: "#cf4848",
		moderate: "#f4ab24",
		safe: "#2fa000e0",
	};
	@Input() VAULT: any;
	@Input() unSorted: any;
	selection: any;
	ngOnInit() {
		this.tally = this.chartService.vaultTally(this.VAULT);
		this.pieTally = this.chartService.pieTally(this.VAULT);
		this.overView = this.chartService.overView(this.unSorted);
		this.health = Math.round(
			((this.overView.secure - this.overView.insecure - this.overView.reused) /
				(this.overView.secure + this.overView.insecure)) *
				100
		);
		this.selection = this.unSorted.map(this.powerCharge);
		console.log(this.unSorted);
		this.barChart = new Chart("barChart", {
			// The type of chart we want to create
			type: "bar",
			// The data for our dataset
			data: {
				labels: Object.keys(this.tally),
				datasets: [
					{
						label: "Secure",
						backgroundColor: "rgba(75, 192, 192, 0.5)",
						borderColor: "rgb(75, 192, 192)",
						data: Object.values(this.tally).map((e) => e[0]),
						hoverBackgroundColor: "rgba(75, 192, 192, 1)",
					},
					{
						label: "Insecure",
						backgroundColor: "rgba(255, 99, 132, 0.5)",
						hoverBackgroundColor: "rgba(255, 99, 132, 1)",
						borderColor: "rgb(255, 99, 132)",
						data: Object.values(this.tally).map((e) => e[1]),
					},
				],
			},
			// Configuration options go here
			options: {
				scales: {
					xAxes: [
						{
							ticks: {
								fontColor: "white",
								fontSize: 15,
							},
						},
					],
					yAxes: [
						{
							ticks: {
								fontColor: "white",
								fontSize: 10,
							},
						},
					],
				},
				legend: {
					labels: {
						fontSize: 12,
						fontColor: "white",
						fontFamily: "'Nunito','sans-serif'",
					},
				},
				title: {
					fontSize: 15,
				},
			},
		});
		this.pieChart = new Chart("pieChart", {
			type: "doughnut",
			data: {
				labels: Object.keys(this.pieTally),
				datasets: [
					{
						borderColor: "rgba(0,0,0,0)",
						data: Object.values(this.VAULT).map((e: any) => e.length),
						backgroundColor: [
							"rgb(255, 99, 132)",
							"rgb(54, 162, 235)",
							"rgb(255, 205, 86)",
							"rgb(186,75,144)",
							"rgb(12,0,92)",
							"rgb(234, 67, 53)",
							"rgb(52, 168, 83)",
							"rgb(66, 133, 244)",
						],
						hoverBorderColor: "rgb(255,255,255)",
					},
				],
			},
			options: {
				legend: {
					position: "bottom",
					align: "start",
					labels: {
						fontColor: "white",
						fontSize: 11,
					},
				},
			},
		});
		this.pieChart.height = 272;
		this.pieChart.width = 368;
	}
	powerCharge(e: any) {
		const cpy = JSON.parse(JSON.stringify(e));
		const bars = Math.round(((e.score - 0) / (90 - 0)) * (4 - 1) + 1);
		cpy.score = [];
		for (let i = 1; i <= bars; i++) {
			cpy.score.push("charge" + i);
		}
		return cpy;
	}
	changeCategory(categ: "total" | "safe" | "unsafe" | "reuse") {
		this.selected = categ;
		console.log(categ);
		switch (categ) {
			case "total":
				this.selection = this.unSorted.map(this.powerCharge);
				break;
			case "safe":
				this.selection = this.unSorted
					.filter((e) => e.secure)
					.map(this.powerCharge);
				break;
			case "unsafe":
				this.selection = this.unSorted
					.filter((e) => !e.secure)
					.map(this.powerCharge);
				break;
			case "reuse":
				this.selection = this.unSorted
					.filter(
						(e) =>
							e.hash in this.overView.REUSEDHASH &&
							this.overView.REUSEDHASH[e.hash] > 1
					)
					.map(this.powerCharge);
				break;
		}
		console.log(this.selection);
	}
}
