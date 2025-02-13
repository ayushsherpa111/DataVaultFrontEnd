import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { NgxElectronModule } from "ngx-electron";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FileNotFoundComponent } from "./file-not-found/file-not-found.component";
import { HttpInterceptorService } from "./Services/http-interceptor.service";

@NgModule({
	declarations: [AppComponent, FileNotFoundComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		ReactiveFormsModule,
		HttpClientModule,
		NgxElectronModule,
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpInterceptorService,
			multi: true,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
