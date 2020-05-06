import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ProductCategoryPercentage } from 'src/app/models/berry-center-map/product-category-percentage.model';
import { RawProductCategory } from 'src/app/models/vendor-details/raw-product-category.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-product-category-percentage-panel',
  templateUrl: './product-category-percentage-panel.component.html',
  styleUrls: ['./product-category-percentage-panel.component.scss']
})
export class ProductCategoryPercentagePanelComponent implements OnChanges {
  @Input() productCategoryPercentages: ProductCategoryPercentage[];
  @Input() categories: RawProductCategory[];
  @Input() currentLocationId: number;

  catgoriesAndWholePercentages: any[] = [];
  byArea = false;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.productCategoryPercentages || changes.categories || changes.currentLocationId) {
      this.calculateCategoriesAndWholePercentages();
    }
  }

  calculateCategoriesAndWholePercentages() {
    if (this.categories && this.productCategoryPercentages && this.currentLocationId) {
      const groupedProductCatPercents = _.groupBy(this.productCategoryPercentages, 'product_category_id');
      const categoriesAndWholePercents = Object.keys(groupedProductCatPercents).map(__key => {
        return {
          categoryId: groupedProductCatPercents[__key][0].product_category_id,
          whole: groupedProductCatPercents[__key].reduce((__total, __next) => __total + __next.percent_of_whole, 0),
        };
      });

      const res = this.categories.map(__cat => {
        const area = this.productCategoryPercentages.find(
          __pc => __pc.location_id === this.currentLocationId && __pc.product_category_id === __cat.id
        );
        const areaTotal = this.productCategoryPercentages
          .filter(__pc => __pc.location_id === this.currentLocationId)
          .reduce((__total, __next) => __total + __next.percent_of_whole, 0);
        return {
          category: __cat.category,
          forArea: (!area || !areaTotal) ? 0 : (area.percent_of_whole / areaTotal) * 100,
          whole: (categoriesAndWholePercents.find(__cawp => __cawp.categoryId === __cat.id) || <any>{}).whole || 0,
        };
      });

      this.catgoriesAndWholePercentages = _.sortBy(res, 'forArea').reverse();
    }
  }
}
