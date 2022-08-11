import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-ecommerce-wishlist',
  templateUrl: './ecommerce-wishlist.component.html',
  styleUrls: ['./ecommerce-wishlist.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' }
})
export class EcommerceWishlistComponent implements OnInit {
  // Public
  public contentHeader: object;
  public products;
  public wishlist;

  /**
   *
   * @param {EcommerceService} _ecommerceService
   */
  constructor(private _ecommerceService: EcommerceService) {}

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to ProductList change
    // this._ecommerceService.onProductListChange.subscribe(res => {
    //   this.products = res;
    //   console.log(this.products);
    // });

    // Subscribe to Wishlist change
    this._ecommerceService.getWishlists().subscribe(res => {
      this.products = res.resultObj;
      console.log("wishlist", this.products);
    });
    // update product is in Wishlist : Boolean
    // this.products.forEach(product => {
    //   product.isInWishlist = this.wishlist.findIndex(p => p.productId === product.id) > -1;
    // });
    
    // this.wl = this.products.forEach(product => {
    //   console.log("test", product);
    //   product.isInWishlist = this.wishlist.find(p => p.productId === product.id) != null;
    // });

    // content header
    this.contentHeader = {
      headerTitle: 'Wish List',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'eCommerce',
            isLink: true,
            link: '/'
          },
          {
            name: 'Wish List',
            isLink: false
          }
        ]
      }
    };
  }
}
