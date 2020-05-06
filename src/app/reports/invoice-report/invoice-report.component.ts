import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { ReportsService } from '../reports.service';
import { RawAttendingFlag } from 'src/app/models/vendor-details/raw-attending-flag.model';
import { RawSponsorLevel } from 'src/app/models/vendor-details/raw-view-sponsor-levels.model';
import { RawBusinessAndBoothInfo } from 'src/app/models/vendor-details/raw-business-and-booth-info.model';

@Component({
  selector: 'app-invoice-report',
  templateUrl: './invoice-report.component.html',
  styleUrls: ['./invoice-report.component.scss']
})
export class InvoiceReportComponent implements OnInit {
  @Input() selectedAttendingFlag: number;
  @Input() attendingFlags: RawAttendingFlag[];

  vendors: any;
  vendorBoothInfo: RawBusinessAndBoothInfo[];
  vendorBoothAssignments: any;
  locationsBooths: any;
  vendorLunches: any;
  sponsorLevels: RawSponsorLevel[];

  tableRecords = [];

  loading = true;

  constructor(private reportsService: ReportsService) { }

  ngOnInit() {
    this.tableRecords = [];

    this.initialize();
  }

  private async initialize() {
    const data = await this.reportsService.getReport('invoices').toPromise();

    const parsedData = data.map(__dataset => JSON.parse(__dataset));
    this.vendors = parsedData[0];
    this.vendorBoothInfo = parsedData[1];
    this.vendorBoothAssignments = parsedData[2];
    this.locationsBooths = parsedData[3];
    this.vendorLunches = parsedData[4];
    this.sponsorLevels = parsedData[5];

    this.tableRecords = this.getTableRecords();

    this.loading = false;
  }

  getTableRecords() {
    // First filter out vendors who have not submitted an application yet or do not have the selected
    // attending status.
    const filteredVendors = this.vendors.filter(__ven => {
      if (__ven.attending_flag_id === this.selectedAttendingFlag) {
        return this.vendorBoothInfo.find(__boothInfo => __boothInfo.vendor_id === __ven.id) ? true : false;
      }

      return false;
    });
    const vendorIds = _.map(_.sortBy(filteredVendors, 'business_name'), 'id');

    const content = vendorIds.map((vendorId: number) => {
      const vendorRecord = filteredVendors.find(__record => __record.id === vendorId);
      const boothInfo = this.vendorBoothInfo.find(__boothInfo => __boothInfo.vendor_id === vendorId);
      const sponsorLevel = this.sponsorLevels.find(__level => __level.id === boothInfo.sponsor_level_id);
      const assignedBooths = this.vendorBoothAssignments.filter(
        __boothAssignment => __boothAssignment.vendor_id === vendorId
      )
      .map((__boothAssignment) => {
        const booth = this.locationsBooths.find(__locBooth => __locBooth.booth_id === __boothAssignment.booth_id);

        return {
          number: booth.booth_number,
          boothPrice: booth.price,
          electricity: __boothAssignment.electricity,
          electricityPrice: __boothAssignment.electricity ? 50 : 0,
        };
      });

      // Sponsors do not pay additional for booths.
      if (sponsorLevel) {
        for (const assignedBooth of assignedBooths) {
          assignedBooth.boothPrice = 0;
        }
      }

      // Filter by attending flag.
      const attendingFlag = this.attendingFlags.find(
        __flag => __flag.id === vendorRecord.attending_flag_id
      );

      const extras = {
        tables: boothInfo.number_table_and_chair,
        tablesPrice: 12 * boothInfo.number_table_and_chair,
        chairs: boothInfo.number_extra_chairs,
        chairsPrice: 3 * boothInfo.number_extra_chairs,
      };

      // Sponsors do not pay for tables or chairs.
      if (sponsorLevel) {
        extras.tablesPrice = 0;
        extras.chairsPrice = 0;
      }

      const lunches = this.vendorLunches
        .filter(__lunch => __lunch.vendor_id === vendorId)
        .map((__lunch) => {
          const multiplyBy = __lunch.type === 'beverage' ? 0 : 15;

          return {
            name: __lunch.description,
            qty: __lunch.quantity,
            cost: multiplyBy * parseInt(__lunch.quantity, 10),
          };
        });

      let total = 0;

      assignedBooths.forEach((booth) => {
        total += parseInt(booth.boothPrice);
        total += parseInt(booth.electricityPrice);
      });

      total += extras.tablesPrice;
      total += extras.chairsPrice;

      lunches.forEach((lunch) => {
        total += lunch.cost;
      });

      // Add sponsor cost if applicable.
      if (sponsorLevel) {
        total += sponsorLevel.price;
      }

      return {
        businessName: vendorRecord.business_name,
        assignedBooths,
        attendingFlag,
        extras,
        lunches,
        sponsorLevel,
        total,
        // truncateStr: Utils.truncateStr
      };
    });

    return content;
  }

}
