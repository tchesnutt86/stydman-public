import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentUserService } from 'src/app/core/current-user.service';
declare var $: any;

@Component({
  selector: 'app-save-button',
  templateUrl: './save-button.component.html',
  styleUrls: ['./save-button.component.scss']
})
export class SaveButtonComponent implements OnInit, OnChanges {
  @Input() savingInProgress: boolean;
  @Input() buttonText?: string;
  @Input() iconClass?: string;
  @Output() buttonClicked = new EventEmitter();
  @ViewChild('saveButton', { static: false }) saveButton: ElementRef;

  hasWriteAccess = false;

  constructor(currentUserService: CurrentUserService) {
    this.hasWriteAccess = currentUserService.getPermissions().hasWriteAccess;
  }

  ngOnInit() {
    if (!this.buttonText) {
      this.buttonText = 'Save';
    }

    if (!this.iconClass) {
      this.iconClass = 'glyphicon-floppy-disk';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.saveButton) {
      if (changes['savingInProgress'].currentValue === true) {
        $(this.saveButton.nativeElement).button('loading');
      } else {
        $(this.saveButton.nativeElement).button('reset');
      }
    }
  }

  async save() {
    this.buttonClicked.emit();
  }

}
