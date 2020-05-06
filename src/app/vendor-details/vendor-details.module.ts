import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorDetailsComponent } from './vendor-details.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { VendorDetailsBoothAssignmentComponent } from './vendor-details-booth-assignment/vendor-details-booth-assignment.component';
import { FormsModule } from '@angular/forms';
import { VendorDetailsNotesComponent } from './vendor-details-notes/vendor-details-notes.component';
import { VendorDetailsPhotosComponent } from './vendor-details-photos/vendor-details-photos.component';
import { VendorDetailsStatusComponent } from './vendor-details-status/vendor-details-status.component';
import { VendorDetailsDetailsComponent } from './vendor-details-details/vendor-details-details.component';
import { DisplayInputEditComponent } from './display-input-edit/display-input-edit.component';
import { CustomPipesModule } from '../pipes/custom-pipes.module';
import { DisplayRadioEditComponent } from './display-radio-edit/display-radio-edit.component';
import { DisplaySelectEditComponent } from './display-select-edit/display-select-edit.component';
import { DisplayComplexRadioEditComponent } from './display-complex-radio-edit/display-complex-radio-edit.component';

@NgModule({
  declarations: [
    VendorDetailsComponent,
    VendorDetailsBoothAssignmentComponent,
    VendorDetailsNotesComponent,
    VendorDetailsPhotosComponent,
    VendorDetailsStatusComponent,
    VendorDetailsDetailsComponent,
    DisplayInputEditComponent,
    DisplayRadioEditComponent,
    DisplaySelectEditComponent,
    DisplayComplexRadioEditComponent,
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    FormsModule,
    CustomPipesModule,
  ],
  exports: [
    VendorDetailsComponent
  ],
  providers: [
    
  ]
})
export class VendorDetailsModule { }
