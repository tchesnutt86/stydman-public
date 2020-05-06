import { Injectable } from '@angular/core';
import { CoreService } from '../core/core.service';
import { Observable } from 'rxjs';
import { RawViewVendorBoothSelectionOptionRecord } from '../models/views/raw-view-vendor-booth-selection-option-record.model';
import { RawViewVendorApplicationOptionsRecord } from '../models/views/raw-view-vendor-application-options-record.model';

@Injectable({
  providedIn: 'root'
})
export class VendorApplicationOptionsService {

  constructor(private coreService: CoreService) { }

  getApplicationOptions(): Observable<any> {
    return this.coreService.get('vendorApplicationOptions.php');
  }

  updateOptions(
    boothSelectionOptions: RawViewVendorBoothSelectionOptionRecord[],
    vendorApplicationOptions: RawViewVendorApplicationOptionsRecord[],
  ): Observable<void> {
    return this.coreService.post(
      'updateVendorApplicationOptions.php',
      {
        boothSelectionOptions,
        vendorApplicationOptions,
      }
    );
  }
}
