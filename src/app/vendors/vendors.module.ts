import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorsComponent } from './vendors.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { VendorsService } from './vendors.service';
import { CustomPipesModule } from '../pipes/custom-pipes.module';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    VendorsComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    CustomPipesModule,
    AppRoutingModule,
    FormsModule,
  ],
  exports: [
    VendorsComponent
  ],
  providers: [
    VendorsService
  ]
})
export class VendorsModule { }
