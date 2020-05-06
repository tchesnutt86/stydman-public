import { Injectable } from '@angular/core';
import { CoreService } from '../core/core.service';
import { Observable } from 'rxjs';
import { RawViewInvitationPendingRedeemed } from '../models/views/raw-view-invitation-pending-redeemed.model';

@Injectable({
  providedIn: 'root'
})
export class InvitationsService {

  constructor(private coreService: CoreService) { }

  getInvitationsPending(): Observable<RawViewInvitationPendingRedeemed[]> {
    return this.coreService.getView('view_invitations_pending');
  }

  getInvitationsRedeemed(): Observable<RawViewInvitationPendingRedeemed[]> {
    return this.coreService.getView('view_invitations_redeemed');
  }

  getInvitationTemplate(templateNumber: number): Observable<{ contents: string }> {
    return this.coreService.get('getEmailTemplate.php', { templateNumber });
  }

  getApplicationLink(email: string, isNonProfitVendor: boolean, inviteTemplate: number): Observable<{ inviteCode: string }> {
    return this.coreService.get(
      'getApplicationLink.php',
      {
        email,
        isNonProfitVendor: isNonProfitVendor ? 1 : 0,
        inviteTemplate,
      }
    );
  }

  sendInviteCode(
    email: string,
    isNonProfitVendor: boolean,
    inviteTemplate: number,
    generateNewInviteCode: boolean,
  ): Observable<{ result: string }> {
    return this.coreService.post(
      'sendInviteCode.php',
      {
        email,
        isNonProfitVendor: isNonProfitVendor ? 1 : 0,
        inviteTemplate,
        generateNewCode: generateNewInviteCode ? 1 : 0,
      }
    );
  }
}
