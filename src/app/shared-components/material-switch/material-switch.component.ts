import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-material-switch',
  templateUrl: './material-switch.component.html',
  styleUrls: ['./material-switch.component.scss']
})
export class MaterialSwitchComponent {
  @Input()
  get value(): string {
    return this._value;
  }
  @Output() valueChange = new EventEmitter();

  private _value: string;
  myId: string;

  constructor() {
    this.myId = this.makeId();
  }

  set value(val: string) {
    this._value = val;
    this.valueChange.emit(this._value);
  }

  makeId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 20; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

}
