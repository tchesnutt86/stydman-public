import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneNumberPipe } from './phone-number.pipe';
import { BoolToYesNoPipe } from './bool-to-yes-no.pipe';
import { TruncateStrPipe } from './truncate-str.pipe';
import { SqlTimeToCSTPipe } from './sql-time-to-cst.pipe';

@NgModule({
  declarations: [
    PhoneNumberPipe,
    BoolToYesNoPipe,
    TruncateStrPipe,
    SqlTimeToCSTPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PhoneNumberPipe,
    BoolToYesNoPipe,
    TruncateStrPipe,
    SqlTimeToCSTPipe,
  ]
})
export class CustomPipesModule { }
