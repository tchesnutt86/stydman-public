import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ValueTextPair } from 'src/app/models/common/value-text.model';

@Component({
  selector: 'app-display-complex-radio-edit',
  templateUrl: './display-complex-radio-edit.component.html',
  styleUrls: ['./display-complex-radio-edit.component.scss']
})
export class DisplayComplexRadioEditComponent {
  @Input()
  get value(): number {
    return this._value;
  }
  @Output() valueChange = new EventEmitter();
  @Input() inEditMode: boolean;
  @Input() groupName = '';
  @Input() radioValueTextList: ValueTextPair[] = [];

  private _value: number;

  constructor() { }

  set value(val: number) {
    this._value = val;
    this.valueChange.emit(this._value);
  }

  getTextFromCurrentValue() {
    const pair = this.radioValueTextList.find(__item => __item.value === this.value);

    if (!pair) {
      return 'No';
    }

    return pair.text;
  }

}
