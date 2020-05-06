import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvancedComponent } from './advanced.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';

@NgModule({
  declarations: [
    AdvancedComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
  ],
  exports: [
    AdvancedComponent
  ]
})
export class AdvancedModule { }
