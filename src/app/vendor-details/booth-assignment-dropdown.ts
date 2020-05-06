import { RawUnassignedBoothsForVendor } from '../models/vendor-details/raw-unassigned-booths-for-vendor.model';

export class BoothAssignmentDropdown {
  selectedLocationId: string;
  selectedBoothId: string;
  electricity: boolean;

  constructor() {
    this.selectedLocationId = '0';
    this.selectedBoothId = '0';
    this.electricity = false;
  }
}
