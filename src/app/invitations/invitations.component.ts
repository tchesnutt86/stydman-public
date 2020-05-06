import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InvitationsService } from './invitations.service';
import * as _ from 'lodash';
import { InviteAVendorPanel } from '../models/invitations/invite-a-vendor-panel.model';
import { Observable } from 'rxjs';
import { RawViewInvitationPendingRedeemed } from '../models/views/raw-view-invitation-pending-redeemed.model';
declare var $: any;

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.scss']
})
export class InvitationsComponent implements OnInit {
  @ViewChild('previewInviteTemplateModal', { static: true }) previewInviteTemplateModal: ElementRef;

  pendingInvitations$: Observable<RawViewInvitationPendingRedeemed[]>;
  redeemedInvitations$: Observable<RawViewInvitationPendingRedeemed[]>;
  inviteAVendorPanel: InviteAVendorPanel = <any>{ };

  gettingApplicationLinkInProgress = false;
  sendingInvitationInProgress = false;
  invitePanelEmailIsValid = true;
  previewTemplateModalContent = '';
  inviteSentMessage = '';

  constructor(private invitationsService: InvitationsService) {
    this.inviteAVendorPanel.emailTemplate = 2;
  }

  ngOnInit() {
    this.loadInvitationHistory();
  }

  private loadInvitationHistory() {
    this.pendingInvitations$ = this.invitationsService.getInvitationsPending();

    this.redeemedInvitations$ = this.invitationsService.getInvitationsRedeemed();
  }

  invitePanelIsValid(): boolean {
    let isValid = true;

    this.invitePanelEmailIsValid = true;

    if (!this.inviteAVendorPanel.email) {
      this.invitePanelEmailIsValid = false;
      isValid = false;
    }

    return isValid;
  }

  async sendInvite() {
    if (!this.invitePanelIsValid()) {
      return;
    }

    this.sendingInvitationInProgress = true;

    const sendResult = await this.invitationsService.sendInviteCode(
      this.inviteAVendorPanel.email,
      this.inviteAVendorPanel.isNonProfitVendor,
      this.inviteAVendorPanel.emailTemplate,
      true,
    ).toPromise();

    if (sendResult.result !== 'db call error') {
      this.sendInviteComplete('Invitation e-mail sent successfully!');
    } else {
      this.sendInviteComplete('There was an error while sending.');
    }
  }

  sendInviteComplete(message: string) {
    this.sendingInvitationInProgress = false;
    this.inviteSentMessage = message;

    setTimeout(() => {
      this.inviteSentMessage = '';
    }, 3000);
  }

  nonProfitVendorCheckClicked(checked: boolean) {
    if (checked) {
      this.inviteAVendorPanel.emailTemplate = 3;
    }
  }

  async previewTemplateClick(templateNumber: number) {
    if (!templateNumber) {
      return;
    }

    const result = await this.invitationsService.getInvitationTemplate(templateNumber).toPromise();

    this.previewTemplateModalContent = result.contents;

    $(this.previewInviteTemplateModal.nativeElement).modal('show');
  }

  async getApplicationLink() {
    if (!this.invitePanelIsValid()) {
      return;
    }

    this.gettingApplicationLinkInProgress = true;

    const result = await this.invitationsService.getApplicationLink(
      this.inviteAVendorPanel.email,
      this.inviteAVendorPanel.isNonProfitVendor,
      this.inviteAVendorPanel.emailTemplate,
    ).toPromise();

    this.gettingApplicationLinkInProgress = false;

    if (result.inviteCode !== 'error') {
      this.inviteAVendorPanel.applicationLink = `http://styd-application.cyfairwomensclub.org/#vendor-form/${result.inviteCode}`;
    }
  }

}
