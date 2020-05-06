import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-display-radio-edit',
  templateUrl: './display-radio-edit.component.html',
  styleUrls: ['./display-radio-edit.component.scss']
})
export class DisplayRadioEditComponent {
  @Input()
  get value(): boolean {
    return this._value;
  }
  @Output() valueChange = new EventEmitter();
  @Input() inEditMode: boolean;
  @Input() groupName: string = '';

  private _value: boolean;

  constructor() { }

  set value(val: boolean) {
    this._value = val;
    this.valueChange.emit(this._value);
  }

}
