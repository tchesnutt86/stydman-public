import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { VendorDetailsService } from '../vendor-details.service';
import { VendorInfoTable } from 'src/app/models/vendor-details/vendor-info-table.model';
import { BusinessAndBoothInfoTable } from 'src/app/models/vendor-details/business-and-booth-info-table.model';
import { RawProductCategory } from 'src/app/models/vendor-details/raw-product-category.model';
import { RawProduct } from 'src/app/models/vendor-details/raw-product.model';
import { RawBoothLocationPreference } from 'src/app/models/vendor-details/raw-booth-location-preference.model';
import { VendorLunchesTable } from './vendor-lunches-table';
import { LunchRow } from 'src/app/models/vendor-details/lunch-row.model';
import { RawLunchMenuRecord } from 'src/app/models/vendor-details/raw-lunch-menu-record.model';
import { ValueTextPair } from 'src/app/models/common/value-text.model';
import * as _ from 'lodash';
import { ValidationsService } from 'src/app/core/validations.service';
import { CurrentUserService } from 'src/app/core/current-user.service';
declare var $: any;

@Component({
  selector: 'app-vendor-details-details',
  templateUrl: './vendor-details-details.component.html',
  styleUrls: ['./vendor-details-details.component.scss']
})
export class VendorDetailsDetailsComponent implements OnInit, OnDestroy {
  @Input() vendorId: number;
  @ViewChild('removeLunchConfirmModal', { static: false }) removeLunchConfirmModal: ElementRef;
  @ViewChild('addLunchModal', { static: false }) addLunchModal: ElementRef;

  hasWriteAccess = false;

  vendorInfoTable: VendorInfoTable = <any>{ };
  inVendorInfoEditMode = false;
  vendorInfoSavingInProgress = false;
  vendorInfoTablePrimaryPhoneIsValid = true;
  vendorInfoTableSecondaryPhoneIsValid = true;

  businessAndBoothInfoTable: BusinessAndBoothInfoTable = <any>{ };
  inBusinessAndBoothInfoEditMode = false;
  businessAndBoothInfoSavingInProgress = false;

  inProductsEditMode = false;
  productsSavingInProgress = false;
  copyOfOriginalRawProducts: RawProduct[] = [];
  rawProducts: RawProduct[] = [];
  rawProductCategories: RawProductCategory[] = [];

  rawBoothLocationPreferences: RawBoothLocationPreference[] = [];

  vendorLunchesTable = new VendorLunchesTable();
  currentRemoveLunchId = 0;
  lunches: ValueTextPair[] = [];
  lunchTypes: ValueTextPair[] = [];
  rawLunchMenuRecords: RawLunchMenuRecord[] = [];
  addLunchModalSelectedLunchId: string;
  addLunchModalSelectedQuantity: string;
  addingLunchInProgress = false;
  interestedInSponsoringValueTextList: ValueTextPair[] = [];
  zeroThruFiveArray = [0, 1, 2, 3, 4, 5];

  constructor(
    public vendorDetailsService: VendorDetailsService,
    private validationsService: ValidationsService,
    currentUserService: CurrentUserService,
  ) {
    this.hasWriteAccess = currentUserService.getPermissions().hasWriteAccess;
  }

  ngOnInit() {
    this.initialize();
  }

  ngOnDestroy() {
    this.vendorDetailsService.sharedBusinessName = '';
  }

  private initialize() {
    this.loadVendorBusinessInfo();
    this.loadBusinessAndBoothInfo();
    this.loadProducts();
    this.loadBoothLocationPreferences();
    this.loadVendorLunches();
  }

  private async loadVendorBusinessInfo() {
    const businessInfoResult = await this.vendorDetailsService.getVendorInfo(this.vendorId).toPromise();
    const businessInfoRecord = businessInfoResult[0];

    this.vendorDetailsService.sharedBusinessName = businessInfoRecord.business_name;

    this.vendorInfoTable = {
      address: businessInfoRecord.address,
      businessName: businessInfoRecord.business_name,
      city: businessInfoRecord.city,
      email: businessInfoRecord.email,
      secondaryEmail: businessInfoRecord.email_secondary,
      firstName: businessInfoRecord.first_name,
      lastName: businessInfoRecord.last_name,
      primaryPhone: businessInfoRecord.phone_primary,
      secondaryPhone: businessInfoRecord.phone_secondary,
      zip: businessInfoRecord.zip,
      website: businessInfoRecord.website,
    };
  }

  private async loadBusinessAndBoothInfo() {
    const [businessAndBoothInfoData, sponsorLevelData] = await Promise.all([
      this.vendorDetailsService.getBusinessAndBoothInfo(this.vendorId).toPromise(),
      this.vendorDetailsService.getSponsorLevels().toPromise(),
    ]);
    const businessAndBoothInfoRecord = businessAndBoothInfoData[0];

    if (businessAndBoothInfoRecord) {
      this.businessAndBoothInfoTable = {
        chairs: businessAndBoothInfoRecord.number_extra_chairs,
        comments: businessAndBoothInfoRecord.vendor_comments,
        directMarketing: businessAndBoothInfoRecord.direct_marketing_business,
        foodSamples: businessAndBoothInfoRecord.food_samples,
        premiumLobby: businessAndBoothInfoRecord.premium_lobby,
        remainInSameBooth: businessAndBoothInfoRecord.remain_same_booth,
        tables: businessAndBoothInfoRecord.number_table_and_chair,
        texasSalesTaxPermitId: businessAndBoothInfoRecord.tax_permit_number,
        willingToAcceptLastMinuteBooth: businessAndBoothInfoRecord.willing_to_accept_last_minute_booth,
        willingToAcceptOutsideBooth: businessAndBoothInfoRecord.willing_to_accept_outside_booth,
        interestedInSponsoring: businessAndBoothInfoRecord.sponsor_level_id,
        inventoryChanged: businessAndBoothInfoRecord.inventory_changed_from_prev_year,
        inventoryChangedComments: businessAndBoothInfoRecord.inventory_changed_comments,
      };
    }

    this.interestedInSponsoringValueTextList = sponsorLevelData.map(__item => <ValueTextPair>{
      text: `Yes (${__item.title})`,
      value: __item.id,
    })
    .concat(<ValueTextPair>{ text: 'No', value: 0 });
  }

  private async loadProducts() {
    // this is simple for now, but need to come back through and add edit functionality.
    this.rawProducts = await this.vendorDetailsService.getProducts(this.vendorId).toPromise();
    this.rawProductCategories = await this.vendorDetailsService.getProductCategories().toPromise();
  }

  private async loadBoothLocationPreferences() {
    this.rawBoothLocationPreferences = await this.vendorDetailsService.getBoothLocationPreferences(this.vendorId).toPromise();
  }

  private async loadVendorLunches() {
    const data = await this.vendorDetailsService.getVendorLunches(this.vendorId).toPromise();

    this.vendorLunchesTable.rows = data.map(__record => {
      return <LunchRow>{
        lunchDescription: __record.description,
        lunchId: __record.lunch_id,
        lunchType: __record.type,
        lunchTypeId: __record.lunch_type_id,
        quantity: __record.quantity,
      };
    });
  }

  vendorInfoEditClick() {
    this.inVendorInfoEditMode = true;
  }

  async vendorInfoSaveClick() {
    if (!this.vendorInfoValuesAreValid()) {
      return;
    }

    this.vendorInfoSavingInProgress = true;

    await this.vendorDetailsService.updateVendorInfo(
      this.vendorId,
      this.vendorInfoTable,
    ).toPromise();

    this.vendorInfoSavingComplete();
  }

  private vendorInfoSavingComplete() {
    this.inVendorInfoEditMode = false;
    this.vendorInfoSavingInProgress = false;
  }

  private vendorInfoValuesAreValid(): boolean {
    let isValid = true;

    // Reset validation values first.
    this.vendorInfoTablePrimaryPhoneIsValid = true;
    this.vendorInfoTableSecondaryPhoneIsValid = true;

    if (!this.validationsService.phoneNumberIsValid(this.vendorInfoTable.primaryPhone)) {
      this.vendorInfoTablePrimaryPhoneIsValid = false;
      isValid = false;
    }

    if (this.vendorInfoTable.secondaryPhone) {
      if (!this.validationsService.phoneNumberIsValid(this.vendorInfoTable.secondaryPhone)) {
        this.vendorInfoTableSecondaryPhoneIsValid = false;
        isValid = false;
      }
    }

    return isValid;
  }

  businessAndBoothInfoEditClick() {
    this.inBusinessAndBoothInfoEditMode = true;
  }

  async businessAndBoothInfoSaveClick() {
    this.businessAndBoothInfoSavingInProgress = true;

    await this.vendorDetailsService.updateBusinessAndBoothInfo(
      this.vendorId,
      this.businessAndBoothInfoTable,
    ).toPromise();

    this.businessAndBoothInfoSavingComplete();
  }

  private businessAndBoothInfoSavingComplete() {
    this.inBusinessAndBoothInfoEditMode = false;
    this.businessAndBoothInfoSavingInProgress = false;
  }

  removeLunch(lunchId: number) {
    this.currentRemoveLunchId = lunchId;
    $(this.removeLunchConfirmModal.nativeElement).modal('show');
  }

  async removeLunchConfirmClicked() {
    await this.vendorDetailsService.removeLunch(this.currentRemoveLunchId).toPromise();

    await this.loadVendorLunches();
  }

  async addLunchClick() {
    this.lunchTypes = [];
    this.lunches = [];
    this.addLunchModalSelectedLunchId = null;
    this.addLunchModalSelectedQuantity = null;

    const data = await this.vendorDetailsService.getLunchMenu().toPromise();

    this.rawLunchMenuRecords = data;

    const lunchTypeVals = _.uniqBy(data, __t => __t.lunch_type_id)
      .map(__record => <ValueTextPair>{
        value: __record.lunch_type_id,
        text: __record.type,
      });
    lunchTypeVals.unshift({ value: 0, text: '' });

    this.lunchTypes = lunchTypeVals;

    $(this.addLunchModal.nativeElement).modal('show');
  }

  lunchTypeChange(selectedLunchTypeId: string) {
    if (!selectedLunchTypeId || selectedLunchTypeId === '0') {
      this.lunches = [];

      return;
    }

    const id = +selectedLunchTypeId;

    this.lunches = this.rawLunchMenuRecords
      .filter(__record => __record.lunch_type_id === id)
      .map(__record => <ValueTextPair>{
        value: __record.id,
        text: __record.description,
      });
  }

  async confirmAddLunch() {
    if (!this.addLunchModalSelectedLunchId || !this.addLunchModalSelectedQuantity) {
      return;
    }

    this.addingLunchInProgress = true;

    await this.vendorDetailsService.addLunch(
      this.vendorId,
      +this.addLunchModalSelectedLunchId,
      +this.addLunchModalSelectedQuantity,
    ).toPromise();

    await this.confirmAddLunchComplete();
  }

  async confirmAddLunchComplete() {
    this.addingLunchInProgress = false;
    $(this.addLunchModal.nativeElement).modal('hide');

    await this.loadVendorLunches();
  }

  addProductClick() {
    const category = this.rawProductCategories[0];
    this.rawProducts.push(<RawProduct>{
      category: '',
      description: '',
      id: 0,
      percentage: 0,
      product_category_id: category.id,
      vendor_id: this.vendorId,
    });
  }

  async editSaveProductsClick(inEditMode: boolean) {
    if (!inEditMode) {
      this.inProductsEditMode = true;

      this.copyOfOriginalRawProducts = JSON.parse(JSON.stringify(this.rawProducts)); // true copy, no refs
    } else { // Save product changes.
      if (this.getTotalProductsPercent() !== 100 || this.duplicateProductCategoriesExist()) {
        return;
      }

      this.productsSavingInProgress = true;
      const rpIds = this.rawProducts.map(__p => __p.id);
      const changes = this.rawProducts.filter(
        __rp => !_.isEqual(__rp, (this.copyOfOriginalRawProducts.find(__cpyRp => __cpyRp.id === __rp.id) || __rp))
      );

      await this.vendorDetailsService.modifyVendorProducts({
        delete: this.copyOfOriginalRawProducts.filter(__cpyRp => !rpIds.includes(__cpyRp.id)),
        add: this.rawProducts.filter(__rp => __rp.id === 0),
        update: changes,
      }).toPromise();

      this.inProductsEditMode = false;
      this.productsSavingInProgress = false;

      this.loadProducts();
    }
  }

  cancelEditProductsClick() {
    this.rawProducts = this.copyOfOriginalRawProducts;

    this.inProductsEditMode = false;
  }

  removeProduct(product: RawProduct) {
    this.rawProducts.splice(this.rawProducts.indexOf(product), 1);
  }

  getTotalProductsPercent() {
    return this.rawProducts.reduce((__total, __next) => __total + parseInt(__next.percentage as any, 10), 0);
  }

  duplicateProductCategoriesExist() {
    const catIds = this.rawProducts.map(__cat => __cat.product_category_id);

    return _.uniq(catIds).length !== catIds.length;
  }

}
