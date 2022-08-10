import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import Swal  from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-ecommerce-checkout-item',
  templateUrl: './ecommerce-checkout-item.component.html',
  styleUrls: ['../ecommerce-checkout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EcommerceCheckoutItemComponent implements OnInit {
  // Input Decorator
  @Input() product;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {EcommerceService} _ecommerceService
   */
  constructor(private _ecommerceService: EcommerceService) {
    this._unsubscribeAll = new Subject();
  }

  /**
   * Remove From Cart
   *
   * @param product
   */
  removeFromCart(product) {
    if (product.isInCart === true) {
      this._ecommerceService.removeFromCart(product.id).then(res => {
        product.isInCart = false;
      });
    }
  }

  /**
   * Toggle Wishlist
   *
   * @param product
   */
  toggleWishlist(product) {
    if (product.isInWishlist === true) {
      this._ecommerceService.removeFromWishlist(product.id).then(res => {
        product.isInWishlist = false;
      });
    }
     else {
      this._ecommerceService.addToWishlist(product.id).subscribe(res => {
        if(res.isSuccessed){
          Swal.fire("Success",res.message,"success");
        }
        else{
          Swal.fire("Warning",res.message,"warning");
        }
      })
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  ngOnInit(): void {}
}
