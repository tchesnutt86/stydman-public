import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumber'
})
export class PhoneNumberPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if (!value) {
      return value;
    }

    const partOne = value.substr(0, 3);
    const partTwo = value.substr(3, 3);
    const partThree = value.substr(6, 4);

    return `(${partOne}) ${partTwo}-${partThree}`;
  }

}
