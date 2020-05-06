import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ValueTextPair } from 'src/app/models/common/value-text.model';

@Component({
  selector: 'app-simple-table-filter',
  templateUrl: './simple-table-filter.component.html',
  styleUrls: ['./simple-table-filter.component.scss']
})
export class SimpleTableFilterComponent implements OnChanges {
  @Input() filterText: string;
  @Input() nameTextPairs: ValueTextPair[];
  @Output() filterChanged = new EventEmitter<ValueTextPair>();

  selectedNameTextPair: ValueTextPair;

  constructor() {
    this.selectedNameTextPair = {
      value: -1,
      text: '',
    };
  }

  ngOnChanges() {
    if (this.nameTextPairs && this.nameTextPairs.length) {
      const defaultOption = this.nameTextPairs.find(
        pair => pair.default
      );

      if (defaultOption) {
        this.filterOptionClick(defaultOption);
      } else {
        this.filterOptionClick(this.nameTextPairs[0]);
      }
    }
  }

  filterOptionClick(option: ValueTextPair) {
    this.selectedNameTextPair = option;
    this.filterChanged.emit(option);
  }

}
