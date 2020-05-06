import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { CurrentUserService } from 'src/app/core/current-user.service';
declare var $: any;

@Component({
  selector: 'app-edit-save-button',
  templateUrl: './edit-save-button.component.html',
  styleUrls: ['./edit-save-button.component.scss']
})
export class EditSaveButtonComponent implements OnInit, OnChanges {
  @Input() savingInProgress: boolean;
  @Output() editClicked = new EventEmitter();
  @Output() saveClicked = new EventEmitter();
  @ViewChild('saveButton', { static: false }) saveButton: ElementRef;

  hasWriteAccess = false;
  inEditMode = false;

  constructor(currentUserService: CurrentUserService) {
    this.hasWriteAccess = currentUserService.getPermissions().hasWriteAccess;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.saveButton) {
      const savingInProgressChange = changes['savingInProgress'];

      if (savingInProgressChange.previousValue === true && savingInProgressChange.currentValue === false) {
        $(this.saveButton.nativeElement).button('reset');
        this.inEditMode = false;
      } else if (!savingInProgressChange.previousValue && savingInProgressChange.currentValue === true) {
        $(this.saveButton.nativeElement).button('loading');
      }
    }
  }

  edit() {
    this.inEditMode = true;
    this.editClicked.emit();
  }

  save() {
    this.saveClicked.emit();
  }

}
