import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VendorDetailsService } from './vendor-details.service';
import { RawAttendingFlag } from '../models/vendor-details/raw-attending-flag.model';
import { RawVendorStatus } from '../models/vendor-details/raw-vendor-status.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.scss']
})
export class VendorDetailsComponent implements OnInit {
  rawAttendingFlags$: Observable<RawAttendingFlag[]>;
  attendingStatus$: Observable<RawVendorStatus>;

  savingVendorStatusInProgress: boolean;

  vendorId: number;

  constructor(
    private route: ActivatedRoute,
    public vendorDetailsService: VendorDetailsService,
  ) { }

  ngOnInit() {
    this.vendorId = +this.route.snapshot.paramMap.get('id');

    this.loadVendorDetailsStatus();
  }

  private loadVendorDetailsStatus() {
    this.rawAttendingFlags$ = this.vendorDetailsService.getAttendingFlags();

    this.attendingStatus$ = this.vendorDetailsService.getVendorStatus(this.vendorId).pipe(
      map(__result => __result[0])
    );
  }

  onSaveVendorStatusClick(event: number) {
    this.savingVendorStatusInProgress = true;

    this.vendorDetailsService.saveVendorStatus(this.vendorId, event)
      .toPromise()
      .then(() => this.savingVendorStatusInProgress = false);
  }
}
