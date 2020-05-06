import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { VendorDetailsService } from '../vendor-details.service';
import { RawVendorFileInfo } from 'src/app/models/vendor-details/raw-vendor-file-info.model';
declare var $: any;

@Component({
  selector: 'app-vendor-details-photos',
  templateUrl: './vendor-details-photos.component.html',
  styleUrls: ['./vendor-details-photos.component.scss']
})
export class VendorDetailsPhotosComponent implements OnInit {
  @Input() vendorId: number;
  @ViewChild('photoSelector', { static: true }) photoSelector: ElementRef;
  @ViewChild('uploadingModal', { static: true }) uploadingModal: ElementRef;

  addPhotoErrorMessageEnabled = false;
  rawVendorFileInfo: RawVendorFileInfo[] = [];

  constructor(private vendorDetailsService: VendorDetailsService) { }

  ngOnInit() {
    this.loadVendorPhotos();
  }

  private async loadVendorPhotos() {
    this.rawVendorFileInfo = await this.vendorDetailsService.getVendorPhotos(this.vendorId).toPromise();
  }

  async addPhotoClick() {
    this.photoSelector.nativeElement.click();
  }

  async deletePhotoClick(fileId: number, fileName: string) {
    await this.vendorDetailsService.deleteVendorPhoto(
      this.vendorId,
      fileId,
      fileName,
    ).toPromise();

    this.loadVendorPhotos();
  }

  async photoSelectorChange(element: HTMLInputElement) {
    const file = element.files[0];

    if (file && file.type.includes('image')) {
      this.addPhotoErrorMessageEnabled = false;

      $(this.uploadingModal.nativeElement).modal('show');

      await this.vendorDetailsService.addVendorPhoto(
        this.vendorId,
        file,
      ).toPromise();

      $(this.uploadingModal.nativeElement).modal('hide');

      this.loadVendorPhotos();
    } else {
      this.addPhotoErrorMessageEnabled = true;
    }
  }

}
