import { Component, OnInit } from '@angular/core';
import { ReportsService } from './reports.service';
import { ValueTextPair } from '../models/common/value-text.model';
import { RawAttendingFlag } from '../models/vendor-details/raw-attending-flag.model';
import * as _ from 'lodash';
declare var $: any;

enum CustomReports {
  VENDORS_REMAINING_IN_SAME_BOOTH = '0',
  VENDOR_INVOICES = '1',
  VENDOR_ASSIGNED_BOOTHS = '2',
  VENDOR_LUNCHES = '3',
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  reports: ValueTextPair[] = [];
  attendingFlags: RawAttendingFlag[] = [];
  showInvoiceReportAttendingFlagOptions = false;
  selectedReport = '-1';
  selectedAttendingFlag: string;
  reportTableHeaders: string[] = [];
  reportTableBodyObjects: any[] = [];
  currentReport = {
    name: '',
    type: '',
  };
  selectedReportCSV: string;

  constructor(private reportsService: ReportsService) { }

  ngOnInit() {
    this.initialize();
  }

  private async initialize() {
    await this.loadAllCSVReportNames();
  }

  private async loadAllCSVReportNames() {
    const data = await this.reportsService.getReportNames().toPromise();

    this.reports = data.map((__record) => {
      return <ValueTextPair>{
        value: <any>__record.TABLE_NAME,
        text: __record.TABLE_NAME.replace(/_/g, ' ').replace(/(view|report)/g, '').toUpperCase(),
      };
    });
  }

  private async loadAttendingFlags() {
    this.showInvoiceReportAttendingFlagOptions = true;

    const results = await this.reportsService.getAttendingFlags().toPromise();

    this.attendingFlags = results;
  }

  private async generateVendorRemainSameBoothReport(remainInSameBooth) {
    const data = await this.reportsService.getReport('vendor and booths').toPromise();
    const vendors = JSON.parse(data[0]);
    const vendorBoothInfo = JSON.parse(data[1]);

    const compiled = vendors.map((vendor) => {
      const boothInfo = vendorBoothInfo.find(
        __info => __info.vendor_id === vendor.id
      );

      return {
        vendorId: vendor.id,
        businessName: vendor.business_name,
        remainSameBooth: boothInfo.remain_same_booth
      };
    });

    const filtered = compiled.filter((info) => info.remainSameBooth === (remainInSameBooth ? '1' : '0'));

    const sorted = _.sortBy(filtered, 'businessName');

    // Prep table.
    this.reportTableHeaders = [
      'Business name',
      'Remain in same booth(s)',
    ];

    this.reportTableBodyObjects = sorted.map((reportEntry: any) => {
      return {
        col1: reportEntry.businessName.toUpperCase(),
        col2: reportEntry.remainSameBooth === '1' ? 'Yes' : 'No',
      };
    });
  }

  async exportToCSV(el: HTMLLinkElement) {
    if (!this.selectedReportCSV) {
      return;
    }

    const data = await this.reportsService.getReportByViewName(this.selectedReportCSV).toPromise();

    if (!data.length) {
      return;
    }

    const fileName = this.selectedReportCSV.replace(/ /g, '_') + '.csv';
    const keys = Object.keys(data[0]);
    let csvContent = `${keys.map(__k => `"${__k}"`).join(',')}\r\n`;

    for (const row of data) {
      const rowContent = [];
      for (const key of keys) {
        rowContent.push($.isNumeric(row[key]) ? row[key] : `"${row[key]}"`);
      }
      csvContent += `${rowContent.join(',')}\r\n`;
    }

    const $dl = $(el);
    $dl.attr('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    $dl.attr('download', fileName);
    $dl[0].click();
  }

  reportSelectorChange(reportValue: string) {
    switch (reportValue) {
      case CustomReports.VENDOR_INVOICES:
        this.loadAttendingFlags();
        break;
      default:
        this.showInvoiceReportAttendingFlagOptions = false;
    }
  }

  generateReportClick() {
    this.reportTableHeaders = [];
    this.reportTableBodyObjects = [];

    switch (this.selectedReport) {
      case '0':
        this.generateVendorRemainSameBoothReport(true);
        break;
      case '1':
        if (!this.selectedAttendingFlag) {
          break;
        }
        this.currentReport.name = 'invoices';
        this.currentReport.type = 'custom';
        break;
      case '2':
        //generateVendorAssignedBooths();
        break;
      default:
        break;
    }
  }

}
