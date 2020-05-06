import { Injectable } from '@angular/core';
import { CoreService } from '../core/core.service';
import { RawUnassignedBoothsForVendor } from '../models/vendor-details/raw-unassigned-booths-for-vendor.model';
import { Observable } from 'rxjs';
import { SaveBoothAssignmentsParams } from '../models/vendor-details/save-booth-assignments-params.model';
import { BoothAssignments } from './booth-assignments';
import { RawBoothAssignment } from '../models/vendor-details/raw-booth-assignment.model';
import { RawCwcVendorNotes } from '../models/vendor-details/raw-cwc-vendor-notes.model';
import { RawVendorFileInfo } from '../models/vendor-details/raw-vendor-file-info.model';
import { HttpHeaders } from '@angular/common/http';
import { RawVendorStatus } from '../models/vendor-details/raw-vendor-status.model';
import { RawAttendingFlag } from '../models/vendor-details/raw-attending-flag.model';
import { RawVendorBusinessInfo } from '../models/vendor-details/raw-vendor-business-info.model';
import { RawBusinessAndBoothInfo } from '../models/vendor-details/raw-business-and-booth-info.model';
import { RawProduct } from '../models/vendor-details/raw-product.model';
import { RawProductCategory } from '../models/vendor-details/raw-product-category.model';
import { RawBoothLocationPreference } from '../models/vendor-details/raw-booth-location-preference.model';
import { RawVendorLunch } from '../models/vendor-details/raw-vendor-lunch.model';
import { RawLunchMenuRecord } from '../models/vendor-details/raw-lunch-menu-record.model';
import { VendorInfoTable } from '../models/vendor-details/vendor-info-table.model';
import { BusinessAndBoothInfoTable } from '../models/vendor-details/business-and-booth-info-table.model';
import { RawSponsorLevel } from '../models/vendor-details/raw-view-sponsor-levels.model';

@Injectable({
  providedIn: 'root'
})
export class VendorDetailsService {
  // Shared properties.
  sharedBoothAssignments = new BoothAssignments();
  sharedBusinessName: string;

  constructor(private coreService: CoreService) { }

  getUnassignedBoothsForVendor(vendorId: number): Observable<RawUnassignedBoothsForVendor[]> {
    return this.coreService.get<RawUnassignedBoothsForVendor[]>(
      'vendorDetails/getUnassignedBoothsForVendor.php',
      { vendorId },
    );
  }

  getBoothAssignmentsForVendor(vendorId: number): Observable<RawBoothAssignment[]> {
    return this.coreService.getView<RawBoothAssignment[]>(
      'view_vendor_booth_assignment',
      vendorId,
    );
  }

  saveBoothAssignments(values: SaveBoothAssignmentsParams): Observable<void> {
    return this.coreService.post(
      'saveBoothAssignment.php',
      values,
    );
  }

  getCwcVendorNotes(vendorId: number): Observable<RawCwcVendorNotes[]> {
    return this.coreService.getView<RawCwcVendorNotes[]>(
      'view_cwc_vendor_note',
      vendorId,
    );
  }

  addCwcVendorNote(vendorId: number, note: string): Observable<void> {
    return this.coreService.post(
      'addCwcNote.php',
      { vendorId, note },
    );
  }

  getVendorPhotos(vendorId: number): Observable<RawVendorFileInfo[]> {
    return this.coreService.getView<RawVendorFileInfo[]>(
      'view_vendor_file_info',
      vendorId,
    );
  }

  deleteVendorPhoto(vendorId: number, fileId: number, fileName: string): Observable<void> {
    return this.coreService.post(
      'vendorDetails/deletePhoto.php',
      { vendorId, fileId, fileName },
    );
  }

  addVendorPhoto(vendorId: number, myFile: File): Observable<void> {
    const data = new FormData();
    data.append('vendorId', <any>vendorId);
    data.append('myFile', <any>myFile);

    return this.coreService.post(
      'vendorDetails/uploadFile.php',
      data,
      {
        headers: {
          'Content-Type': false,
          'Process-Data': false,
        }
      }
    );
  }

  getVendorStatus(vendorId: number): Observable<RawVendorStatus[]> {
    return this.coreService.getView<RawVendorStatus[]>(
      'view_vendor_status',
      vendorId,
    );
  }

  getAttendingFlags(): Observable<RawAttendingFlag[]> {
    return this.coreService.getView('view_attending_flag');
  }

  saveVendorStatus(vendorId: number, attendingFlagId: number) {
    return this.coreService.post(
      'vendorDetails/updateVendorStatus.php',
      {
        vendorId,
        attendingFlagId,
      }
    );
  }

  getVendorInfo(vendorId: number): Observable<RawVendorBusinessInfo[]> {
    return this.coreService.getView(
      'view_vendor_details',
      vendorId,
    );
  }

  updateVendorInfo(vendorId: number, vendorInfoTable: VendorInfoTable) {
    return this.coreService.post(
      'vendorDetails/updateVendorInfo.php',
      {
        vendorId,
        ...vendorInfoTable,
      }
    );
  }

  updateBusinessAndBoothInfo(vendorId: number, businessAndBoothInfo: BusinessAndBoothInfoTable) {
    return this.coreService.post(
      'vendorDetails/updateVendorBusinessInfo.php',
      {
        vendorId,
        ...businessAndBoothInfo,
      }
    );
  }

  getBusinessAndBoothInfo(vendorId: number): Observable<RawBusinessAndBoothInfo[]> {
    return this.coreService.getView(
      'view_vendor_booth_info',
      vendorId,
    );
  }

  getProducts(vendorId: number): Observable<RawProduct[]> {
    return this.coreService.getView<RawProduct[]>(
      'view_vendor_products',
      vendorId,
    );
  }

  getProductCategories(): Observable<RawProductCategory[]> {
    return this.coreService.getView('view_product_categories');
  }

  modifyVendorProducts(data: any): Observable<any> {
    return this.coreService.post('vendorDetails/modifyProducts.php', data);
  }

  getBoothLocationPreferences(vendorId: number): Observable<RawBoothLocationPreference[]> {
    return this.coreService.getView(
      'view_vendor_booth_selection',
      vendorId,
    );
  }

  getVendorLunches(vendorId: number): Observable<RawVendorLunch[]> {
    return this.coreService.getView(
      'view_vendor_lunches',
      vendorId,
    );
  }

  getLunchMenu(): Observable<RawLunchMenuRecord[]> {
    return this.coreService.getView('view_lunch_menu');
  }

  addLunch(vendorId: number, lunchId: number, quantity: number) {
    return this.coreService.post(
      'vendorDetails/addLunch.php',
      {
        vendorId,
        lunchId,
        quantity,
      }
    );
  }

  removeLunch(vendorLunchId: number) {
    return this.coreService.post(
      'vendorDetails/deleteLunch.php',
      { vendorLunchId },
    );
  }

  getSponsorLevels(): Observable<RawSponsorLevel[]> {
    return this.coreService.getView('view_sponsor_levels');
  }
}
