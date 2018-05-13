import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { TjxHeatMapService } from './services/tjx_heatmap.service';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,      
    LeafletModule.forRoot(),
    HttpModule
  ],
  providers: [
    TjxHeatMapService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
