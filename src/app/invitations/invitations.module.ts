import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { FormsModule } from '@angular/forms';
import { InvitationsComponent } from './invitations.component';
import { CustomPipesModule } from '../pipes/custom-pipes.module';
import { InvitationsStatusTableComponent } from './invitations-status-table/invitations-status-table.component';

@NgModule({
  declarations: [
    InvitationsComponent,
    InvitationsStatusTableComponent,
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    FormsModule,
    CustomPipesModule,
  ],
  exports: [
    InvitationsComponent,
  ]
})
export class InvitationsModule { }
