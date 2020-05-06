import { Injectable } from '@angular/core';
import { CoreService } from '../core/core.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdvancedService {

  constructor(private coreService: CoreService) { }

  getInvitesSentLastHourCount(): Observable<any> {
    return this.coreService.get(
      'common/getStoredProcedure.php',
      { procName: 'sp_GetInvitesSentLastHourCount' },
    );
  }

  getReturningVendorInviteList(): Observable<any> {
    return this.coreService.get(
      'common/getStoredProcedure.php',
      { procName: 'sp_GetReturningVendorInviteList' },
    );
  }

  getNewVendorInviteList(): Observable<any> {
    return this.coreService.get(
      'common/getStoredProcedure.php',
      { procName: 'sp_GetNewVendorInviteList' },
    );
  }

  sendInviteCode(
    email: string,
    isNonProfitVendor: boolean,
    inviteTemplate: number,
    generateNewCode: boolean,
  ): Observable<{ result: string }> {
    return this.coreService.post(
      'sendInviteCode.php',
      {
        email,
        isNonProfitVendor: isNonProfitVendor ? 1 : 0,
        inviteTemplate,
        generateNewCode: generateNewCode ? 1 : 0,
      }
    );
  }
}
