import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { FormsModule } from '@angular/forms';
import { InvoiceReportComponent } from './invoice-report/invoice-report.component';
import { CustomPipesModule } from '../pipes/custom-pipes.module';

@NgModule({
  declarations: [ReportsComponent, InvoiceReportComponent],
  imports: [
    CommonModule,
    SharedComponentsModule,
    FormsModule,
    CustomPipesModule,
  ]
})
export class ReportsModule { }
