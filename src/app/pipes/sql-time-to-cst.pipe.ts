import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'sqlTimeToCST'
})
export class SqlTimeToCSTPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      return moment(value, 'YYYY-MM-DD HH:mm:ss')
      .add(1, 'hours')
      .format('MM/DD/YY h:mm A');
    }

    return value;
  }

}
