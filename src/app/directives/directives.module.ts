import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QtipDirective } from './qtip.directive';

@NgModule({
  declarations: [
    QtipDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    QtipDirective
  ]
})
export class DirectivesModule { }
