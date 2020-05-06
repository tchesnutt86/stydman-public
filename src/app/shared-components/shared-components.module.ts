import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeadingComponent } from './page-heading/page-heading.component';
import { SimpleTableFilterComponent } from './simple-table-filter/simple-table-filter.component';
import { SaveButtonComponent } from './save-button/save-button.component';
import { EditSaveButtonComponent } from './edit-save-button/edit-save-button.component';
import { DangerMessageComponent } from './danger-message/danger-message.component';
import { MaterialSwitchComponent } from './material-switch/material-switch.component';
import { FormsModule } from '@angular/forms';
import { MaterialCheckboxComponent } from './material-checkbox/material-checkbox.component';
import { StandardButtonWithPermissionsComponent } from './standard-button-with-permissions/standard-button-with-permissions.component';

@NgModule({
  declarations: [
    PageHeadingComponent,
    SimpleTableFilterComponent,
    SaveButtonComponent,
    EditSaveButtonComponent,
    DangerMessageComponent,
    MaterialSwitchComponent,
    MaterialCheckboxComponent,
    StandardButtonWithPermissionsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    PageHeadingComponent,
    SimpleTableFilterComponent,
    SaveButtonComponent,
    EditSaveButtonComponent,
    DangerMessageComponent,
    MaterialSwitchComponent,
    MaterialCheckboxComponent,
    StandardButtonWithPermissionsComponent,
  ]
})
export class SharedComponentsModule { }
