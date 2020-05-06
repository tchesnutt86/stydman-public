import { Component, OnInit, Input } from '@angular/core';
import { RawCwcVendorNotes } from 'src/app/models/vendor-details/raw-cwc-vendor-notes.model';
import { VendorDetailsService } from '../vendor-details.service';
import * as moment from 'moment';

@Component({
  selector: 'app-vendor-details-notes',
  templateUrl: './vendor-details-notes.component.html',
  styleUrls: ['./vendor-details-notes.component.scss']
})
export class VendorDetailsNotesComponent implements OnInit {
  @Input() vendorId: number;

  rawCwcVendorNotes: RawCwcVendorNotes[] = [];
  addingNoteInProgress = false;
  cwcNoteText = '';

  constructor(private vendorDetailsService: VendorDetailsService) { }

  ngOnInit() {
    this.loadCwcVendorNotes();
  }

  private async loadCwcVendorNotes() {
    const resultData = await this.vendorDetailsService.getCwcVendorNotes(this.vendorId).toPromise();

    this.rawCwcVendorNotes = resultData
      .sort((a, b) => moment(a.create_time).diff(moment(b.create_time)))
      .reverse();
  }

  async addNote() {
    if (!this.cwcNoteText) {
      return;
    }

    this.addingNoteInProgress = true;

    await this.vendorDetailsService.addCwcVendorNote(this.vendorId, this.cwcNoteText).toPromise();

    await this.addNoteComplete();
  }

  private async addNoteComplete() {
    this.addingNoteInProgress = false;
    this.cwcNoteText = '';

    await this.loadCwcVendorNotes();
  }

}
