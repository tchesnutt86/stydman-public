import { Injectable } from '@angular/core';
import { CoreService } from '../core/core.service';
import { Observable } from 'rxjs';
import { RawAttendingFlag } from '../models/vendor-details/raw-attending-flag.model';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private coreService: CoreService) { }

  getReportNames(): Observable<{ TABLE_NAME: string }[]> {
    return this.coreService.get('reportsAll.php');
  }

  getAttendingFlags(): Observable<RawAttendingFlag[]> {
    return this.coreService.getView('view_attending_flag');
  }

  getReport(reportName: string): Observable<any> {
    return this.coreService.get('reports.php', { reportName });
  }

  getReportByViewName(reportViewName: string): Observable<any> {
    return this.coreService.getView(reportViewName);
  }
}
