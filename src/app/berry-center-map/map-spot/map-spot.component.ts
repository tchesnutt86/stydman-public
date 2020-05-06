import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { RawViewMapDataRecord } from 'src/app/models/views/raw-view-map-data-record.model';
import { RawViewVendorBoothAssignmentRecord } from 'src/app/models/views/raw-view-vendor-booth-assignment-record.model';
import { RawViewVendorsRecord } from 'src/app/models/views/raw-view-vendors-record.model';
import { RawViewVendorProductsRecord } from 'src/app/models/views/raw-view-vendor-products-record.model';
import { RawAttendingFlag } from 'src/app/models/vendor-details/raw-attending-flag.model';
declare var $: any;

interface QtipValues {
  boothAssignment: RawViewVendorBoothAssignmentRecord;
  vendor: RawViewVendorsRecord;
  products: RawViewVendorProductsRecord[];
  attendingFlags: RawAttendingFlag[];
}

@Component({
  selector: 'app-map-spot',
  templateUrl: './map-spot.component.html',
  styleUrls: ['./map-spot.component.scss']
})
export class MapSpotComponent implements OnInit {
  @ViewChild('spot', { static: true }) el: ElementRef;
  @Input() qtipValues: QtipValues;
  @Input() boothLocation: RawViewMapDataRecord;
  @Input() highlightOn: boolean;

  vendorId: number;

  constructor() { }

  ngOnInit() {
    const qTipObj: any = {
      content: {
        title: '',
        text: '<div class="text-center"><i>Vacant</i></div>',
      },
      position: {
        my: 'bottom center',
        at: 'top center',
      },
      style: {
        classes: 'qtip-bootstrap qtip-custom-width',
      },
      hide: {
        event: 'unfocus mouseleave',
      },
    };

    if (this.qtipValues) {
      this.vendorId = this.qtipValues.vendor.id;
    }

    qTipObj.content.title = `
      <div class="row">
        <div class="col-xs-4 text-bold">${this.boothLocation.number}</div>
        <div class="col-xs-4 text-center text-bold">${this.boothLocation.booth_length}x${this.boothLocation.booth_width}</div>
        <div class="col-xs-4 text-right text-bold">$${this.boothLocation.booth_price}</div>
      </div>
      ${this.getVendorStatusRow()}
    `;

    if (this.qtipValues) {
      const productsContent = this.qtipValues.products.map((product) => {
        return `
          <tr>
            <td class="category text-uppercase">${product.category}</td>
            <td class="description text-uppercase">${product.description.replace(/,|;|:/g, ' ')}</td>
            <td class="percentage">${product.percentage}%</td>
          </tr>
        `;
      });

      qTipObj.content.text = `
        <table class="table table-condensed table-bordered qtip-table">
          <thead>
            <tr>
              <th colspan="3" class="text-uppercase">${this.qtipValues.vendor.business_name}</th>
            </tr>
          </thead>
          <tbody>
            ${productsContent.join('')}
          </tbody>
        </table>
      `;
    }

    $(this.el.nativeElement).qtip(qTipObj);
  }

  private getVendorStatusRow() {
    let resultText = '';

    if (this.qtipValues && this.qtipValues.attendingFlags) {
      const flag = this.qtipValues.attendingFlags.find(
        __flag => __flag.id === this.qtipValues.vendor.attending_flag_id
      );

      if (flag) {
        resultText = `
          <div class="row margin-top-sm">
            <div class="col-xs-12 text-center">${flag.description}</div>
          </div>
        `;
      }
    }

    return resultText;
  }

  getLink(): string {
    if (this.vendorId) {
      return `/vendor-details/${this.vendorId}`;
    }

    return '';
  }

  getHighlightColor(): string {
    let result = 'transparent';

    if (this.qtipValues && this.qtipValues.attendingFlags && this.highlightOn) {
      const flag = this.qtipValues.attendingFlags.find(
        __flag => __flag.id === this.qtipValues.vendor.attending_flag_id
      );

      if (flag) {
        result = flag.map_hex_color.toUpperCase() === '#FFFFFF' ? 'transparent' : flag.map_hex_color;
      }
    }

    return result;
  }

  // onMouseOver() {
  //   console.log('yoi');
  //   $('.qtip').remove(); // bugs out
  // }

}
