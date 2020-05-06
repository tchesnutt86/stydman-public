import { Component, OnInit, Input, ElementRef, OnDestroy } from '@angular/core';
import { BoothAssignmentDropdown } from '../booth-assignment-dropdown';
import { RawUnassignedBoothsForVendor } from 'src/app/models/vendor-details/raw-unassigned-booths-for-vendor.model';
import { VendorDetailsService } from '../vendor-details.service';
import * as _ from 'lodash';
import { BoothLocation } from 'src/app/models/vendor-details/location.model';
import { RawBoothAssignment } from 'src/app/models/vendor-details/raw-booth-assignment.model';

@Component({
  selector: 'app-vendor-details-booth-assignment',
  templateUrl: './vendor-details-booth-assignment.component.html',
  styleUrls: ['./vendor-details-booth-assignment.component.scss']
})
export class VendorDetailsBoothAssignmentComponent implements OnInit, OnDestroy {
  @Input() vendorId: number;

  savingBoothAssignmentsInProgress = false;
  savedBoothAssignmentsMessageActive = false;
  boothAssignmentDropdown1: BoothAssignmentDropdown = new BoothAssignmentDropdown();
  boothAssignmentDropdown2: BoothAssignmentDropdown = new BoothAssignmentDropdown();
  boothAssignmentDropdown3: BoothAssignmentDropdown = new BoothAssignmentDropdown();
  boothAssignmentDropdown4: BoothAssignmentDropdown = new BoothAssignmentDropdown();
  private rawUnassignedBoothsForVendor: RawUnassignedBoothsForVendor[] = [];
  // private groupedUnassignedBoothsForVendor: any;
  locations: BoothLocation[] = [];

  constructor(public vendorDetailsService: VendorDetailsService) {
  }

  ngOnInit() {
    this.initialize();
  }

  ngOnDestroy() {
    this.vendorDetailsService.sharedBoothAssignments.clearBoothAssignments();
  }

  private async initialize() {
    await this.loadUnassignedBoothsForVendor();
    await this.loadBoothAssignmentsForVendor();
  }

  private async loadUnassignedBoothsForVendor() {
    const unassignedBoothsForVendor: RawUnassignedBoothsForVendor[] =
      await this.vendorDetailsService.getUnassignedBoothsForVendor(this.vendorId).toPromise();

    if (!unassignedBoothsForVendor) {
      return;
    }

    this.rawUnassignedBoothsForVendor = unassignedBoothsForVendor;

    const parsedLocations = _.chain(unassignedBoothsForVendor)
      .map((record: RawUnassignedBoothsForVendor) => {
        return <BoothLocation>{
          id: record.booth_location_id,
          name: record.booth_location,
        };
      })
      .uniqBy((item: BoothLocation) => item.id)
      .value();
    parsedLocations.unshift({ id: 0, name: 'Unassigned' });

    this.locations = parsedLocations;
  }

  private async loadBoothAssignmentsForVendor() {
    const rawBoothAssignments: RawBoothAssignment[] =
      await this.vendorDetailsService.getBoothAssignmentsForVendor(this.vendorId).toPromise();

    rawBoothAssignments.forEach(__record => {
      const dropdown = this.getBoothAssignmentDropdown(__record.booth_number_id);

      dropdown.selectedLocationId = __record.booth_location_id.toString();
      dropdown.selectedBoothId = __record.booth_id.toString();
      dropdown.electricity = __record.electricity;

      // Update the shared variable in the service so the vendor details tab is updated.
      this.vendorDetailsService.sharedBoothAssignments.updateBoothAssignment(
        __record.booth_number_id,
        __record.number,
        __record.electricity,
        __record.location,
      );
    });
  }

  getBoothAssignmentDropdown(dropdownNumber: number): BoothAssignmentDropdown {
    switch (dropdownNumber) {
      case 1:
        return this.boothAssignmentDropdown1;
      case 2:
        return this.boothAssignmentDropdown2;
      case 3:
        return this.boothAssignmentDropdown3;
      case 4:
        return this.boothAssignmentDropdown4;
      default:
        return null;
    }
  }

  getBoothOptionsForDropdownNumber(currentDropdownNumber: number): RawUnassignedBoothsForVendor[] {
    const resultDropdown = this.getBoothAssignmentDropdown(currentDropdownNumber);
    const options = this.rawUnassignedBoothsForVendor.filter(
      __record => __record.booth_location_id === +resultDropdown.selectedLocationId
    );

    return options || [];
  }

  boothLocationDropdownChange(dropdownNumber: number, locationValue: string, elElectricity: HTMLInputElement) {
    if (locationValue === '0') {
      const dropdown = this.getBoothAssignmentDropdown(dropdownNumber);

      dropdown.selectedBoothId = null;
      dropdown.electricity = false;
      elElectricity.checked = false;
    }
  }

  selectedBoothDropdownOrElectricityDisable(dropdownNumber: number): boolean {
    const dropdown = this.getBoothAssignmentDropdown(dropdownNumber);

    return dropdown.selectedLocationId === null
      || dropdown.selectedLocationId === '0';
  }

  async saveBoothAssignments() {
    this.savingBoothAssignmentsInProgress = true;

    let booth1SaveValue = +this.boothAssignmentDropdown1.selectedBoothId;
    let booth2SaveValue = +this.boothAssignmentDropdown2.selectedBoothId;
    let booth3SaveValue = +this.boothAssignmentDropdown3.selectedBoothId;
    let booth4SaveValue = +this.boothAssignmentDropdown4.selectedBoothId;

    booth1SaveValue = (booth1SaveValue !== 0) ? booth1SaveValue : null;
    booth2SaveValue = (booth2SaveValue !== 0) ? booth2SaveValue : null;
    booth3SaveValue = (booth3SaveValue !== 0) ? booth3SaveValue : null;
    booth4SaveValue = (booth4SaveValue !== 0) ? booth4SaveValue : null;

    await this.vendorDetailsService.saveBoothAssignments({
      booth1: booth1SaveValue,
      booth2: booth2SaveValue,
      booth3: booth3SaveValue,
      booth4: booth4SaveValue,
      electricity1: this.boothAssignmentDropdown1.electricity ? 1 : 0,
      electricity2: this.boothAssignmentDropdown2.electricity ? 1 : 0,
      electricity3: this.boothAssignmentDropdown3.electricity ? 1 : 0,
      electricity4: this.boothAssignmentDropdown4.electricity ? 1 : 0,
      vendorId: this.vendorId,
    })
    .toPromise();

    this.saveBoothAssignmentsComplete();
  }

  saveBoothAssignmentsComplete() {
    this.savedBoothAssignmentsMessageActive = true;
    this.savingBoothAssignmentsInProgress = false;

    setTimeout(() => this.savedBoothAssignmentsMessageActive = false, 3000);

    // Update the shared variable in the service so the vendor details tab is updated.
    for (let i = 1; i <= 4; i++) {
      const booth = this.getBoothAssignmentDropdown(i);
      const location = this.locations.find(
        __record => __record.id === +booth.selectedLocationId
      );
      const rawBooth = this.rawUnassignedBoothsForVendor.find(
        __record => __record.booth_id === +booth.selectedBoothId
      );

      if (!location) {
        this.vendorDetailsService.sharedBoothAssignments.updateBoothAssignment(
          i,
          '',
          null,
          '',
        );
      } else {
        this.vendorDetailsService.sharedBoothAssignments.updateBoothAssignment(
          i,
          rawBooth ? rawBooth.booth_number : '',
          booth.electricity,
          location ? location.name : '',
        );
      }
    }
  }

}
