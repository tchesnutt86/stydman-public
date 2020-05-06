import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateStr'
})
export class TruncateStrPipe implements PipeTransform {

  transform(value: string, maxLength: string): any {
    if (value.length > +maxLength) {
      return value.substring(0, +maxLength - 2) + '...';
    }

    return value;
  }

}
