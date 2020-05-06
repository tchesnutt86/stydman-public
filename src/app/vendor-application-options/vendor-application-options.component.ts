import { Component, OnInit } from '@angular/core';
import { VendorApplicationOptionsService } from './vendor-application-options.service';
import { RawViewVendorApplicationOptionsRecord } from '../models/views/raw-view-vendor-application-options-record.model';
import { RawViewVendorBoothSelectionOptionRecord } from '../models/views/raw-view-vendor-booth-selection-option-record.model';
import { Locations } from '../models/enums/locations.enum';

@Component({
  selector: 'app-vendor-application-options',
  templateUrl: './vendor-application-options.component.html',
  styleUrls: ['./vendor-application-options.component.scss']
})
export class VendorApplicationOptionsComponent implements OnInit {
  arenaOptions = [];
  conferenceCenterOptions = [];
  hallwayOptions = [];
  outsideOptions = [];
  vestibuleOptions = [];
  upstairsSouthConcourse = [];
  savingOptionsInProgress = false;

  private boothSelectionOptions: RawViewVendorBoothSelectionOptionRecord[] = [];
  applicationOptions: RawViewVendorApplicationOptionsRecord[] = [];

  constructor(private vendorApplicationOptionsService: VendorApplicationOptionsService) { }

  ngOnInit() {
    this.initialize();
  }

  private async initialize() {
    await this.loadApplicationOptions();
  }

  private async loadApplicationOptions() {
    const data = await this.vendorApplicationOptionsService.getApplicationOptions().toPromise();

    const parsedData = data.map(__record => JSON.parse(__record));

    this.applicationOptions = parsedData[1];

    this.mapBoothSelectionOptions(parsedData[0]);
  }

  mapBoothSelectionOptions(options: RawViewVendorBoothSelectionOptionRecord[]) {
    this.boothSelectionOptions = options.sort((a, b) => <any>a.description - <any>b.description);

    this.arenaOptions = this.boothSelectionOptions.filter(__record => __record.booth_location_id === Locations.ARENA);
    this.conferenceCenterOptions = this.boothSelectionOptions.filter(
      __record => __record.booth_location_id === Locations.CONFERENCE_CENTER
    );
    this.hallwayOptions = this.boothSelectionOptions.filter(__record => __record.booth_location_id === Locations.HALLWAY);
    this.outsideOptions = this.boothSelectionOptions.filter(__record => __record.booth_location_id === Locations.OUTSIDE);
    this.vestibuleOptions = this.boothSelectionOptions.filter(__record => __record.booth_location_id === Locations.VESTIBULE);
    this.upstairsSouthConcourse = this.boothSelectionOptions.filter(
      __record => __record.booth_location_id === Locations.UPSTAIRS_SOUTH_CONCOURSE
    );
  }

  async saveOptions() {
    this.savingOptionsInProgress = true;

    await this.vendorApplicationOptionsService.updateOptions(
      this.boothSelectionOptions,
      this.applicationOptions,
    ).toPromise();

    this.saveOptionsComplete();
  }

  saveOptionsComplete() {
    this.savingOptionsInProgress = false;
  }

}
