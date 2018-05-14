import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { TjxHeatMapService } from './services/tjx_heatmap.service';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,      
    LeafletModule.forRoot(),
    BsDatepickerModule.forRoot(),
    HttpModule
  ],
  providers: [
    TjxHeatMapService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
