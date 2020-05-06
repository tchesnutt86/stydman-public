import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BerryCenterMapComponent } from './berry-center-map.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../directives/directives.module';
import { MapSpotComponent } from './map-spot/map-spot.component';
import { AppRoutingModule } from '../app-routing.module';
import { ProductCategoryPercentagePanelComponent } from './product-category-percentage-panel/product-category-percentage-panel.component';

@NgModule({
  declarations: [
    BerryCenterMapComponent,
    MapSpotComponent,
    ProductCategoryPercentagePanelComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    FormsModule,
    DirectivesModule,
    AppRoutingModule,
  ],
  exports: [
    BerryCenterMapComponent
  ]
})
export class BerryCenterMapModule { }
