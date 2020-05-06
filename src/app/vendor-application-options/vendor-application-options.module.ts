import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorApplicationOptionsComponent } from './vendor-application-options.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';

@NgModule({
  declarations: [
    VendorApplicationOptionsComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
  ],
  exports: [
    VendorApplicationOptionsComponent
  ]
})
export class VendorApplicationOptionsModule { }
