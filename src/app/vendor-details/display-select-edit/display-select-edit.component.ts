import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-display-select-edit',
  templateUrl: './display-select-edit.component.html',
  styleUrls: ['./display-select-edit.component.scss']
})
export class DisplaySelectEditComponent {
  @Input()
  get value(): any {
    return this._value;
  }
  @Input() options: any[];
  @Input() valueProperty: string;
  @Input() textProperty: string;
  @Input() inEditMode: boolean;
  @Output() valueChange = new EventEmitter();

  private _value: any;

  constructor() { }

  set value(val: any) {
    this._value = val;
    this.valueChange.emit(this._value);
  }

  getDisplayText() {
    if (this.options && this.options.length) {
      if (_.isObject(this.options[0]) && this.valueProperty && (this.value !== null || this.value !== undefined)) {
        const val = this.options.find(__i => __i[this.valueProperty] === this.value);

        return val ? val[this.textProperty] : '';
      } else if (!_.isObject(this.options[0])) {
        return this.value;
      }

      return '';
    }

    return '';
  }
}
