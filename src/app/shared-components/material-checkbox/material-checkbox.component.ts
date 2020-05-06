import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-material-checkbox',
  templateUrl: './material-checkbox.component.html',
  styleUrls: ['./material-checkbox.component.scss']
})
export class MaterialCheckboxComponent {
  @Input()
  get value(): string {
    return this._value;
  }
  @Input() text: string;
  @Output() valueChange = new EventEmitter();

  private _value: string;

  constructor() { }

  set value(val: string) {
    this._value = val;
    this.valueChange.emit(this._value);
  }

}
