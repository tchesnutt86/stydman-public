import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationsService {

  constructor() { }

  phoneNumberIsValid(phoneStr: string): boolean {
    let isValid = true;

    if (phoneStr) {
      const trimmed = phoneStr.replace(/[^0-9]/g, '');

      isValid = (trimmed.length === 10);
    }

    return isValid;
  }
}
