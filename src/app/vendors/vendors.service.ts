import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RawVendorsListRecord } from '../models/vendors/raw-vendors-list-record.model';
import { CoreService } from '../core/core.service';
import { VendorsCache } from '../models/vendors/vendors-cache.model';

@Injectable({
  providedIn: 'root'
})
export class VendorsService {
  cache: VendorsCache = {
    selectedApplicationStatusOption: <any>{ },
    selectedAttendingFlagOption: <any>{ },
    selectedBoothStatusOption: <any>{ },
  };

  constructor(
    private coreService: CoreService
  ) { }

  getVendors(): Observable<any[]> {
    return this.coreService.getView<RawVendorsListRecord[]>('view_vendors_home');
  }

  getAttendingFlags(): Observable<any[]> {
    return this.coreService.getView<any>('view_attending_flag');
  }
}
