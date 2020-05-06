import { Directive, Input, ElementRef } from '@angular/core';
import { RawViewVendorBoothAssignmentRecord } from '../models/views/raw-view-vendor-booth-assignment-record.model';
import { RawViewVendorsRecord } from '../models/views/raw-view-vendors-record.model';
import { RawViewVendorProductsRecord } from '../models/views/raw-view-vendor-products-record.model';
declare var $: any;

interface LocalInputValue {
  boothAssignment: RawViewVendorBoothAssignmentRecord;
  vendor: RawViewVendorsRecord;
  products: RawViewVendorProductsRecord[];
}

@Directive({
  selector: '[appQtip]'
})
export class QtipDirective {
  @Input('appQtip') values: LocalInputValue;

  constructor(private el: ElementRef) {
    // Need to use setTimeout here to ensure that the Input value is not null.
    setTimeout(() => {
      
    });
  }

}
