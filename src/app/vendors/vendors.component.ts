import { Component, OnInit } from '@angular/core';
import { VendorList } from '../models/vendors/vendor-list.model';
import { ValueTextPair } from '../models/common/value-text.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VendorsService } from './vendors.service';
import { BoothStatusOptions } from '../models/enums/booth-status-options.enum';
import { ApplicationStatusOptions } from '../models/enums/application-status-options.enum';
import { RawVendorsListRecord } from '../models/vendors/raw-vendors-list-record.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {
  vendorList: VendorList[];
  filterBoothStatusOptions: ValueTextPair[];
  filterAttendingFlagOptions: Observable<ValueTextPair[]>;
  filterApplicationStatusOptions: ValueTextPair[];
  filterText = '';

  private unfilteredVendorList: VendorList[] = [];

  constructor(
    private vendorsService: VendorsService
  ) { }

  ngOnInit() {
    this.loadVendorList();
    this.loadFilters();
  }

  private loadFilters() {
    this.loadBoothStatusFilter();
    this.loadAttendingFlagFilter();
    this.loadApplicationStatusFilter();
  }

  private loadBoothStatusFilter() {
    const options: ValueTextPair[] = [
      { value: BoothStatusOptions.all, text: 'All' },
      { value: BoothStatusOptions.assigned, text: 'Assigned' },
      { value: BoothStatusOptions.unassigned, text: 'Unassigned' },
    ];

    if (this.vendorsService.cache.selectedBoothStatusOption.value) {
      this.setDefaultForNameTextPair(options, this.vendorsService.cache.selectedBoothStatusOption.value);
    } else {
      this.setDefaultForNameTextPair(options, BoothStatusOptions.all);
    }

    this.filterBoothStatusOptions = options;
  }

  private loadAttendingFlagFilter() {
    this.filterAttendingFlagOptions = this.vendorsService.getAttendingFlags()
      .pipe(
        map((__response: any) => {
          __response = __response.map((__flag: any) => {
            return <ValueTextPair>{
              value: __flag.id,
              text: __flag.description
            };
          });

          // Add the "all" option to the begining list since it does not exist in the DB.
          __response.unshift(<ValueTextPair>{
            value: (-1 as any),
            text: 'All'
          });

          if (this.vendorsService.cache.selectedAttendingFlagOption.value) {
            this.setDefaultForNameTextPair(__response, this.vendorsService.cache.selectedAttendingFlagOption.value);
          }

          return __response;
        })
      );
  }

  private loadApplicationStatusFilter() {
    const options: ValueTextPair[] = [
      { value: ApplicationStatusOptions.all, text: 'All' },
      { value: ApplicationStatusOptions.submitted, text: 'Submitted' },
    ];

    if (this.vendorsService.cache.selectedApplicationStatusOption.value) {
      this.setDefaultForNameTextPair(options, this.vendorsService.cache.selectedApplicationStatusOption.value);
    } else {
      this.setDefaultForNameTextPair(options, ApplicationStatusOptions.submitted);
    }

    this.filterApplicationStatusOptions = options;
  }

  private loadVendorList() {
    this.vendorsService.getVendors()
      .subscribe((__response: any) => {
        __response = this.mapRawVendorsToVendorList(__response);

        this.unfilteredVendorList = __response;

        this.runThroughAllFilters();
      });
  }

  private setDefaultForNameTextPair(options: ValueTextPair[], defaultValue: number) {
    const foundOption: ValueTextPair = options.find(
      __item => __item.value === defaultValue
    );

    if (!foundOption) {
      return;
    }

    foundOption.default = true;
  }

  private mapRawVendorsToVendorList(rawVendorData: RawVendorsListRecord[]): VendorList[] {
    const uniqueVendorIds: number[] = _.uniq(_.map(rawVendorData, 'id'));

    const newVendorList: VendorList[] = uniqueVendorIds.map((vendorId) => {
      const vendor: RawVendorsListRecord = rawVendorData.find(__vendor => __vendor.id === vendorId);

      return {
        id: vendorId,
        booths: this.getVendorBooths(vendorId, rawVendorData),
        businessName: vendor.business_name,
        email: vendor.email,
        attendingFlagId: vendor.attending_flag_id,
        attendingFlagDescription: vendor.attending_flag_description,
        applicationSubmitted: Boolean(vendor.redeemed),
        inviteCreateTime: vendor.invite_create_time,
        inviteUpdateTime: Boolean(vendor.redeemed) ? vendor.invite_update_time : '',
      };
    });

    return newVendorList;
  }

  private getVendorBooths(vendorId: number, rawVendorData: RawVendorsListRecord[]): string[] {
    return rawVendorData
      .filter(__vendor => __vendor.id === vendorId && __vendor.number)
      .map(__vendor => __vendor.number);
  }

  runThroughAllFilters() {
    if (!this.unfilteredVendorList) {
      return;
    }

    let vendorListBasicCopy = this.unfilteredVendorList.map(__vendor => __vendor);

    if (this.vendorsService.cache.selectedBoothStatusOption.value) {
      if (this.vendorsService.cache.selectedBoothStatusOption.value === BoothStatusOptions.assigned) {
        vendorListBasicCopy = vendorListBasicCopy.filter(__vendor => __vendor.booths.length);
      } else if (this.vendorsService.cache.selectedBoothStatusOption.value === BoothStatusOptions.unassigned) {
        vendorListBasicCopy = vendorListBasicCopy.filter(__vendor => !__vendor.booths.length);
      }
    }

    if (this.vendorsService.cache.selectedAttendingFlagOption.value &&
      this.vendorsService.cache.selectedAttendingFlagOption.value !== -1) {
      vendorListBasicCopy = vendorListBasicCopy.filter(
        __vendor => __vendor.attendingFlagId === this.vendorsService.cache.selectedAttendingFlagOption.value
      );
    }

    if (this.vendorsService.cache.selectedApplicationStatusOption.value) {
      if (this.vendorsService.cache.selectedApplicationStatusOption.value === ApplicationStatusOptions.submitted) {
        vendorListBasicCopy = vendorListBasicCopy.filter(
          __vendor => __vendor.applicationSubmitted
        );
      }
    }

    if (this.filterText) {
      const ft = this.filterText.trim().toLowerCase();

      vendorListBasicCopy = vendorListBasicCopy.filter(
        __vendor => `${__vendor.id} ${__vendor.businessName} ${__vendor.email}`.toLowerCase().includes(ft)
      );
    }

    this.vendorList = vendorListBasicCopy;
  }

  filterBoothStatusChanged(option: ValueTextPair) {
    this.vendorsService.cache.selectedBoothStatusOption = option;

    this.runThroughAllFilters();
  }

  filterAttendingFlagChanged(option: ValueTextPair) {
    this.vendorsService.cache.selectedAttendingFlagOption = option;

    this.runThroughAllFilters();
  }

  filterApplicationStatusChanged(option: ValueTextPair) {
    this.vendorsService.cache.selectedApplicationStatusOption = option;

    this.runThroughAllFilters();
  }

  clearFilterText() {
    this.filterText = '';

    this.runThroughAllFilters();
  }
}
