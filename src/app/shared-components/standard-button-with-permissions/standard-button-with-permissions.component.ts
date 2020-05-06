import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CurrentUserService } from 'src/app/core/current-user.service';

@Component({
  selector: 'app-standard-button-with-permissions',
  templateUrl: './standard-button-with-permissions.component.html',
  styleUrls: ['./standard-button-with-permissions.component.scss']
})
export class StandardButtonWithPermissionsComponent implements OnInit {
  @Input() buttonText?: string;
  @Input() btnClasses?: string;
  @Input() iconClass?: string;
  @Output() buttonClicked = new EventEmitter();

  hasWriteAccess = false;

  constructor(currentUserService: CurrentUserService) {
    this.hasWriteAccess = currentUserService.getPermissions().hasWriteAccess;
  }

  ngOnInit() {
  }

  clicked() {
    this.buttonClicked.emit();
  }

}
