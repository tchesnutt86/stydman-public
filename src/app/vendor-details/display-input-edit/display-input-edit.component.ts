import { Component, Input, Output, EventEmitter } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-display-input-edit',
  templateUrl: './display-input-edit.component.html',
  styleUrls: ['./display-input-edit.component.scss']
})
export class DisplayInputEditComponent {
  @Input()
  get value(): any {
    return this.castToNumber ? parseInt(this._value, 10) : this._value;
  }
  @Input() inEditMode: boolean;
  @Input() castToNumber?: boolean;
  @Input() pipe: string;
  @Output() valueChange = new EventEmitter();

  private _value: any;

  constructor() { }

  set value(val: any) {
    if (this.castToNumber) {
      this._value = $.isNumeric(val) ? parseInt(val, 10) : 0;
    } else {
      this._value = val;
    }

    this.valueChange.emit(this._value);
  }
}
