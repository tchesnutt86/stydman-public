import { Injectable } from '@angular/core';
import { CoreService } from '../core/core.service';
import { Observable } from 'rxjs';
import { RawProductCategory } from '../models/vendor-details/raw-product-category.model';
import { RawAttendingFlag } from '../models/vendor-details/raw-attending-flag.model';
import { ProductCategoryFilterItem } from '../models/berry-center-map/product-category-filter-item.model';
import { ProductCategoryPercentage } from '../models/berry-center-map/product-category-percentage.model';

@Injectable({
  providedIn: 'root'
})
export class BerryCenterMapService {
  cacheFilterCategories: ProductCategoryFilterItem[] = [];
  cacheFilterTextCategories = 'All';

  constructor(private coreService: CoreService) { }

  getMapData(): Observable<string[]> {
    return this.coreService.get('mapData.php');
  }

  getCategories(): Observable<RawProductCategory[]> {
    return this.coreService.getView('view_product_categories');
  }

  getAttendingFlags(): Observable<RawAttendingFlag[]> {
    return this.coreService.getView('view_attending_flag');
  }

  sp_GetProductCategoryPercentagesOfTotalInSections(): Observable<ProductCategoryPercentage[]> {
    return this.coreService.get(
      'common/getStoredProcedure.php',
      { procName: 'sp_GetProductCategoryPercentagesOfTotalInSections' },
    );
  }
}
