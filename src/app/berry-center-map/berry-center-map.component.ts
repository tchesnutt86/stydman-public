import { Component, OnInit, OnDestroy } from '@angular/core';
import { BerryCenterMapService } from './berry-center-map.service';
import { Locations } from '../models/enums/locations.enum';
import { RawViewVendorsRecord } from '../models/views/raw-view-vendors-record.model';
import { RawViewVendorBoothAssignmentRecord } from '../models/views/raw-view-vendor-booth-assignment-record.model';
import { RawViewVendorProductsRecord } from '../models/views/raw-view-vendor-products-record.model';
import { RawViewMapDataRecord } from '../models/views/raw-view-map-data-record.model';
import { RawProductCategory } from '../models/vendor-details/raw-product-category.model';
import { RawAttendingFlag } from '../models/vendor-details/raw-attending-flag.model';
import { ProductCategoryFilterItem } from '../models/berry-center-map/product-category-filter-item.model';
import * as _ from 'lodash';
import { BerryCenterMapTab } from '../models/enums/berry-center-map-tab.enum';
import { ProductCategoryPercentage } from '../models/berry-center-map/product-category-percentage.model';
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-berry-center-map',
  templateUrl: './berry-center-map.component.html',
  styleUrls: ['./berry-center-map.component.scss']
})
export class BerryCenterMapComponent implements OnInit, OnDestroy {
  berryCenterMapTab = BerryCenterMapTab;
  activeTab: BerryCenterMapTab = BerryCenterMapTab.Outside;
  locationDataOutside: any = [];
  locationDataHallway: any = [];
  locationDataLobby = [];
  locationDataArena = [];
  locationDataConferenceCenter = [];
  locationDataVestibules = [];
  locationDataUpstairsSouthConcourse = [];
  private vendors: RawViewVendorsRecord[] = [];
  private boothAssignments: RawViewVendorBoothAssignmentRecord[] = [];
  private vendorProducts: RawViewVendorProductsRecord[] = [];
  private locationData: RawViewMapDataRecord[] = [];
  alwaysOn = { fillColor: '00ff00', alwaysOn: true, stroke: false };
  selectedCategoryId = '-1';
  selectedCategoryIds: string[] = [];
  categories: RawProductCategory[] = [];
  attendingFlags: RawAttendingFlag[] = [];
  productCategoryPercentages$: Observable<ProductCategoryPercentage[]>;

  constructor(public berryCenterMapService: BerryCenterMapService) { }

  ngOnInit() {
    $(document).on('click', '.allow-focus', (event) => {
      event.stopPropagation();
    });

    this.initialize();
  }

  ngOnDestroy() {
    $('.qtip').remove();

    $(document).off('click', '.allow-focus');
  }

  private async initialize() {
    this.productCategoryPercentages$ = this.berryCenterMapService.sp_GetProductCategoryPercentagesOfTotalInSections();
    await Promise.all([
      this.loadAttendingFlags(),
      this.loadCategories(),
    ]);
    await this.loadMapData();
  }

  private async loadAttendingFlags() {
    const data = await this.berryCenterMapService.getAttendingFlags().toPromise();

    this.attendingFlags = data;
  }

  private async loadCategories() {
    const data = await this.berryCenterMapService.getCategories().toPromise();

    this.categories = data;

    if (!this.berryCenterMapService.cacheFilterCategories.length) {
      this.berryCenterMapService.cacheFilterCategories = data.map((__record) => {
        return <ProductCategoryFilterItem>{
          category: __record.category,
          checked: true,
          id: __record.id,
        };
      });
    }
  }

  private async loadMapData() {
    const mapData = await this.berryCenterMapService.getMapData().toPromise();
    const parsedMapData = mapData.map(__record => JSON.parse(__record));

    this.vendors = parsedMapData[0];
    this.boothAssignments = parsedMapData[1];
    this.vendorProducts = parsedMapData[2];
    this.locationData = parsedMapData[3];

    this.runFilters();
  }

  private runFilters() {
    this.locationDataOutside = this.locationData.filter(
      __loc => __loc.location_id === Locations.OUTSIDE
    );
    this.locationDataHallway = this.locationData.filter(
      __loc => __loc.location_id === Locations.HALLWAY
    );
    this.locationDataLobby = this.locationData.filter(
      __loc => __loc.location_id === Locations.LOBBY
    );
    this.locationDataArena = this.locationData.filter(
      __loc => __loc.location_id === Locations.ARENA
    );
    this.locationDataConferenceCenter = this.locationData.filter(
      __loc => __loc.location_id === Locations.CONFERENCE_CENTER
    );
    this.locationDataVestibules = this.locationData.filter(
      __loc => __loc.location_id === Locations.VESTIBULE
    );
    this.locationDataUpstairsSouthConcourse = this.locationData.filter(
      __loc => __loc.location_id === Locations.UPSTAIRS_SOUTH_CONCOURSE
    );
  }

  highlightMapSpot(boothId: number): boolean {
    return this.hasBoothAssignment(boothId) && this.isInSelectedCategory(boothId);
  }

  private hasBoothAssignment(boothId: number): boolean {
    return this.boothAssignments.find(__record => __record.booth_id === boothId) ? true : false;
  }

  private isInSelectedCategory(boothId: number): boolean {
    if (this.berryCenterMapService.cacheFilterCategories.every(__category => __category.checked)) {
      return true;
    }

    const selectedCategoryIds = this.berryCenterMapService.cacheFilterCategories
      .filter(__category => __category.checked)
      .map(__category => __category.id);

    const boothAssignment = this.boothAssignments.find(__record => __record.booth_id === boothId);
    const vendor = this.vendors.find(__record => __record.id === boothAssignment.vendor_id);
    const productCategoryIds = this.vendorProducts
      .filter(__product => __product.vendor_id === vendor.id)
      .map(__product => __product.product_category_id);

    const categoriesInCommon = _.intersection(selectedCategoryIds, productCategoryIds);

    return categoriesInCommon.length > 0;
  }

  getQtipObject(boothId: number) {
    const boothAssignment = this.boothAssignments.find(__record => __record.booth_id === boothId);

    if (!boothAssignment) {
      return null;
    }

    const vendor = this.vendors.find(__record => __record.id === boothAssignment.vendor_id);
    const products = this.vendorProducts.filter(__product => __product.vendor_id === vendor.id);

    return {
      boothAssignment,
      vendor,
      products,
      attendingFlags: this.attendingFlags,
    };
  }

  private setFilterCategoryText() {
    if (this.berryCenterMapService.cacheFilterCategories.every(__item => __item.checked)) {
      this.berryCenterMapService.cacheFilterTextCategories = 'All';
    } else if (this.berryCenterMapService.cacheFilterCategories.every(__item => !__item.checked)) {
      this.berryCenterMapService.cacheFilterTextCategories = 'None';
    } else {
      this.berryCenterMapService.cacheFilterTextCategories = 'Some';
    }
  }

  categoryClick(checkbox: HTMLInputElement) {
    this.berryCenterMapService.cacheFilterCategories = this.berryCenterMapService.cacheFilterCategories.map((__record) => {
      if (__record.id === +checkbox.value) {
        __record.checked = checkbox.checked;
      }

      return __record;
    });

    this.setFilterCategoryText();
  }

  filterCategoriesAllClick() {
    this.berryCenterMapService.cacheFilterTextCategories = 'All';
    this.berryCenterMapService.cacheFilterCategories = this.berryCenterMapService.cacheFilterCategories.map((__record) => {
      __record.checked = true;

      return __record;
    });
  }

  filterCategoriesNoneClick() {
    this.berryCenterMapService.cacheFilterTextCategories = 'None';
    this.berryCenterMapService.cacheFilterCategories = this.berryCenterMapService.cacheFilterCategories.map((__record) => {
      __record.checked = false;

      return __record;
    });
  }

  setActiveTab(val: BerryCenterMapTab) {
    this.activeTab = val;
  }
}
