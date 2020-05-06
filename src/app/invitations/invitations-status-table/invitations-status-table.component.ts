import { Component, Input } from '@angular/core';
import { RawViewInvitationPendingRedeemed } from 'src/app/models/views/raw-view-invitation-pending-redeemed.model';

@Component({
  selector: 'app-invitations-status-table',
  templateUrl: './invitations-status-table.component.html',
  styleUrls: ['./invitations-status-table.component.scss']
})
export class InvitationsStatusTableComponent {
  @Input() tableTitle: string;
  @Input() tableRows: RawViewInvitationPendingRedeemed[];
  @Input() header1: string;
  @Input() header2: string;

  filterText = '';

  filteredRows() {
    const ft = this.filterText.toLowerCase();

    return (this.tableRows || []).filter(__row => __row.email.toLowerCase().includes(ft));
  }

  clearFilterText() {
    this.filterText = '';
  }
}
