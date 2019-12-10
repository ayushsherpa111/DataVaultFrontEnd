import { RegisterModule } from "./Register/register.module";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FileNotFoundComponent } from "./file-not-found/file-not-found.component";

@NgModule({
  declarations: [AppComponent, FileNotFoundComponent],
  imports: [BrowserModule, AppRoutingModule, RegisterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
