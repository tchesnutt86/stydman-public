import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { RawAttendingFlag } from 'src/app/models/vendor-details/raw-attending-flag.model';
import { RawVendorStatus } from 'src/app/models/vendor-details/raw-vendor-status.model';

@Component({
  selector: 'app-vendor-details-status',
  templateUrl: './vendor-details-status.component.html',
  styleUrls: ['./vendor-details-status.component.scss']
})
export class VendorDetailsStatusComponent implements OnChanges {
  @Input() rawAttendingFlags: RawAttendingFlag[];
  @Input() attendingStatus: RawVendorStatus;
  @Input() vendorId: number;
  @Input() savingVendorStatusInProgress: boolean;
  @Output() saveVendorStatusClicked = new EventEmitter<number>();

  selectedAttendingFlagId: number;
  showSaveVendorStatusMessage = false;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.attendingStatus && changes.attendingStatus.currentValue) {
      this.selectedAttendingFlagId = (changes.attendingStatus.currentValue as RawVendorStatus).attending_flag_id;
    } else if (changes.savingVendorStatusInProgress) {
      if (changes.savingVendorStatusInProgress.previousValue === true && changes.savingVendorStatusInProgress.currentValue === false) {
        this.saveVendorStatusComplete();
      }
    }
  }

  private saveVendorStatusComplete() {
    this.showSaveVendorStatusMessage = true;

    setTimeout(() => {
      this.showSaveVendorStatusMessage = false;
    }, 3000);
  }
}
