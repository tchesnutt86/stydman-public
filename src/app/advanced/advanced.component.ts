import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AdvancedService } from './advanced.service';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.scss']
})
export class AdvancedComponent implements OnInit {
  @ViewChild('btnRefresh', { static: true }) btnRefresh: ElementRef;
  invitesSentLastHourCount = 0;
  returningVendorInviteList = [];
  returningVendorInviteList$ = new BehaviorSubject<any[]>(null);
  newVendorInviteList = [];
  newVendorInviteList$ = new BehaviorSubject<any[]>(null);
  reminderList = [];
  maxPerHourLimit = 60;
  time = new Date();

  hideNew = false;
  hideReturning = true;
  hideReminders = true;

  constructor(private advancedService: AdvancedService) { }

  ngOnInit() {
    this.updateReturningVendorInviteList();
    this.updateNewVendorInviteList();
  }

  private async updateInvitesSentLastHourCount() {
    const invitesSent = await this.advancedService.getInvitesSentLastHourCount().toPromise();

    this.invitesSentLastHourCount = invitesSent[0].invites_sent_last_hour;
  }

  updateReturningVendorInviteList() {
    return new Promise((resolve, reject) => {
      this.advancedService.getReturningVendorInviteList().toPromise().then((__res) => {
        const formattedResults = __res.map((record) => {
          return {
            email: record.email,
            status: record.status,
            statusText: this.getInviteStatus(record.status),
            business_name: record.business_name,
          };
        });

        this.returningVendorInviteList$.next(formattedResults);

        resolve();
      },
      () => reject());
    });
  }

  updateNewVendorInviteList() {
    return new Promise((resolve, reject) => {
      this.advancedService.getNewVendorInviteList().toPromise().then((__res) => {
        const formattedResults = __res.map((record) => {
          return {
            email: record.email,
            status: record.status,
            statusText: this.getInviteStatus(record.status),
          };
        });

        this.newVendorInviteList$.next(formattedResults);

        resolve();
      },
      () => reject());
    });
  }

  private getInviteStatus(status: number) {
    switch (status) {
      case 0:
        return '';
      case 1:
        return 'sent';
      case 2:
        return 'redeemed';
      default:
        return '';
    }
  }

  async refreshReturningVendorInviteSection() {
    this.btnRefresh.nativeElement.disabled = true;

    await this.updateInvitesSentLastHourCount();

    this.btnRefresh.nativeElement.disabled = false;
  }

  async sendReturningVendorInvitesClick(btn: HTMLButtonElement) {
    btn.disabled = true;

    const returningVendorEmailTemplate = 1;

    const STATUS_SENT = 1;
    const STATUS_REDEEMED = 2;

    const interval = setInterval(() => {
      if (moment(new Date()).seconds() % 10 === 0) {
        this.advancedService.getInvitesSentLastHourCount().toPromise().then((invitesSent) => {
          this.invitesSentLastHourCount = invitesSent[0].invites_sent_last_hour;

          if (this.invitesSentLastHourCount < this.maxPerHourLimit) {
            this.updateReturningVendorInviteList().then(() => {
              // get next in line
              const nextInLine = this.returningVendorInviteList$.value.find(
                __val => __val.status !== STATUS_SENT && __val.status !== STATUS_REDEEMED
              );

              if (!nextInLine) {
                console.log('all invites sent');
                btn.disabled = false;
                clearInterval(interval);
              } else {
                this.advancedService.sendInviteCode(nextInLine.email, false, returningVendorEmailTemplate, true).toPromise().then(() => {
                  this.updateReturningVendorInviteList();
                });
              }
            },
            () => {
              console.log('err interval stopped');
              clearInterval(interval);
            });
          }
        });
      }
    }, 1000);

    // await this.refreshReturningVendorInviteSection();

    // if (this.invitesSentLastHourCount >= this.maxPerHourLimit) {
    //   console.log('too many invites in the past hour');

    //   return;
    // }

    // btn.disabled = true;

    // for (const row of this.returningVendorInviteList) {
    //   const rowStatus = parseInt(row.status);

    //   if (rowStatus === STATUS_SENT || rowStatus === STATUS_REDEEMED) {
    //     continue;
    //   }

    //   if (this.invitesSentLastHourCount < this.maxPerHourLimit) {
    //     const data = await this.advancedService.sendInviteCode(row.email, false, returningVendorEmailTemplate, true).toPromise();

    //     if (data.result === 'OK') {
    //       console.log(`sent to: ${row.email}`);
    //       this.invitesSentLastHourCount++;

    //       row.statusText = 'sent';
    //     } else {
    //       console.log('error sending invite');

    //       break;
    //     }
    //   } else {
    //     break;
    //   }
    // }

    // btn.disabled = false;
  }

  async sendNewVendorInvitesClick(btn: HTMLButtonElement) {
    btn.disabled = true;
    const newVendorEmailTemplate = 2;
    const STATUS_SENT = 1;
    const STATUS_REDEEMED = 2;

    const interval = setInterval(() => {
      if (moment(new Date()).seconds() % 10 === 0) {
        this.advancedService.getInvitesSentLastHourCount().toPromise().then((invitesSent) => {
          this.invitesSentLastHourCount = invitesSent[0].invites_sent_last_hour;

          if (this.invitesSentLastHourCount < this.maxPerHourLimit) {
            this.updateNewVendorInviteList().then(() => {
              // get next in line
              const nextInLine = this.newVendorInviteList$.value.find(
                __val => __val.status !== STATUS_SENT && __val.status !== STATUS_REDEEMED
              );

              if (!nextInLine) {
                console.log('all invites sent');
                btn.disabled = false;
                clearInterval(interval);
              } else {
                this.advancedService.sendInviteCode(nextInLine.email, false, newVendorEmailTemplate, true).toPromise().then(() => {
                  this.updateNewVendorInviteList();
                });
              }
            },
            () => {
              console.log('err interval stopped');
              clearInterval(interval);
            });
          }
        });
      }
    }, 1000);

    // await this.refreshReturningVendorInviteSection();

    // if (this.invitesSentLastHourCount >= this.maxPerHourLimit) {
    //   console.log('too many invites in the past hour');

    //   return;
    // }

    // btn.disabled = true;

    // for (const row of this.newVendorInviteList) {
    //   const rowStatus = parseInt(row.status);

    //   if (rowStatus === STATUS_SENT || rowStatus === STATUS_REDEEMED) {
    //     continue;
    //   }

    //   if (this.invitesSentLastHourCount < this.maxPerHourLimit) {
    //     const data = await this.advancedService.sendInviteCode(row.email, false, newVendorEmailTemplate, true).toPromise();

    //     if (data.result === 'OK') {
    //       console.log(`sent to: ${row.email}`);
    //       this.invitesSentLastHourCount++;

    //       row.status = 1;
    //     } else {
    //       console.log('error sending invite');

    //       break;
    //     }
    //   } else {
    //     break;
    //   }
    // }

    // btn.disabled = false;
  }

  async sendRemindersClick(btn: HTMLButtonElement) {
    const returningVendorEmailTemplate = 1;
    const newVendorEmailTemplate = 2;
    const STATUS_SENT = 1;
    const STATUS_REDEEMED = 2;

    // await this.refreshReturningVendorInviteSection();

    if (this.invitesSentLastHourCount >= this.maxPerHourLimit) {
      console.log('too many invites in the past hour');

      return;
    }

    btn.disabled = true;

    for (const row of this.returningVendorInviteList) {
      const reminderRecord = this.reminderList.find(__record => __record.email === row.email);

      if (row.status === STATUS_SENT
        && !reminderRecord
        && (this.invitesSentLastHourCount < this.maxPerHourLimit)) {

        const data = await this.advancedService.sendInviteCode(row.email, false, returningVendorEmailTemplate, false).toPromise();

        if (data.result === 'OK') {
          console.log(`sent to: ${row.email}`);
          this.invitesSentLastHourCount++;

          row.statusText = 'reminder sent';

          this.reminderList.push(row);
        } else {
          console.log('error sending invite');
        }
      }
    }

    console.log('reminder array', this.reminderList);

    btn.disabled = false;
  }

  async loadNewVendorInvites() {
    let results = await $.get('assets/2019_new_vendor_email_list.txt');
    results = results
      .split(/\r?\n/)
      .map((s) => {
        return {
          email: s,
          status: 0,
          statusText: '',
        };
      });
    this.newVendorInviteList = results;
  }

}
