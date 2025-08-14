import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Map } from './map/map';
import { MapComponent, provideMapboxGL, ControlComponent, GeolocateControlDirective, NavigationControlDirective, ScaleControlDirective, MarkerComponent, PopupComponent, LayerComponent, GeoJSONSourceComponent } from 'ngx-mapbox-gl';
import { MglMapResizeDirective } from './mgl-map-resize.directive';

@NgModule({
  declarations: [
    App,
    Map
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MapComponent,
    ControlComponent,
    GeolocateControlDirective,
    NavigationControlDirective,
    ScaleControlDirective,
    MarkerComponent,
    PopupComponent,
    LayerComponent,
    GeoJSONSourceComponent,
    MglMapResizeDirective
],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideMapboxGL({
      accessToken : "pk.eyJ1IjoibW9oYW1lZGVsa2EiLCJhIjoiY21lYm9qYzJoMTdiaDJqcjM5ZmdrdmVhdCJ9.LNjH0q2gQ8vEgC1JSWpu5Q"
    })
  ],
  bootstrap: [App]
})
export class AppModule { }
