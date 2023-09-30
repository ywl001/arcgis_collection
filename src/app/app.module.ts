import { HttpClientModule } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppInjector } from './app-injector';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BuildingComponent } from './building/building.component';
import { CompassComponent } from './compass/compass.component';
import { HouseComponent } from './house/house.component';
import { MapComponent } from './map/map.component';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    BuildingComponent,
    HouseComponent,
    CompassComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(injector: Injector) {
    AppInjector.setInjector(injector);
  }
}
