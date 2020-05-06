import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boolToYesNo'
})
export class BoolToYesNoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === null || value === undefined) {
      return '-';
    }

    return value ? 'Yes' : 'No';
  }

}
