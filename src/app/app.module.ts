import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HeatmapTjxComponent } from './heatmap-tjx/heatmap-tjx.component'
import { AuthGuard } from './gaurds/auth.gaurds';
import { HttpModule } from '@angular/http';
import { TjxHeatMapService } from './services/tjx_heatmap.service';
import { TjxMinMaxDateService } from './services/tjx_min_max_date.service';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
const appRoutes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'tjx', component: HeatmapTjxComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
 ];
 
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeatmapTjxComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,      
    LeafletModule.forRoot(),
    BsDatepickerModule.forRoot(),
    HttpModule
  ],
  providers: [
    TjxHeatMapService,
    TjxMinMaxDateService,
    DatePipe,
    AuthenticationService,
    UserService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
