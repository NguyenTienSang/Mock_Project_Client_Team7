import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import Swal  from 'sweetalert2/dist/sweetalert2.js';
import { EcommerceWishlistComponent } from '../../ecommerce-wishlist/ecommerce-wishlist.component';

@Component({
  selector: 'app-ecommerce-checkout-item',
  templateUrl: './ecommerce-checkout-item.component.html',
  styleUrls: ['../ecommerce-checkout.component.scss'],
  styles: [`
    .star {
      position: relative;
      display: inline-block;
      font-size: 1.3rem;
    }
    .full {}
    .half {
      position: absolute;
      display: inline-block;
      overflow: hidden;
    }
    .text-warning {
      color: #ff902b !important;
    }
  `],
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
      this._ecommerceService.totalPriceCart -=  Number((product.price - (product.price * product.discount*0.01)).toFixed(2))  *product.quantityInCart;
      this._ecommerceService.totalPriceCart = Number(this._ecommerceService.totalPriceCart.toFixed(2));
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
    if (product.isInWishlist) {
      Swal.fire({
        title: 'Are you sure want to remove?',
        text: 'You will not be able to recover this file!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this._ecommerceService.removeFromWishlist(product.id).then((res=>{
            product.isInWishlist = false;
            console.log(res);
          }),
          (error=>{
            Swal.fire("Error",error,"error");
          })
          );
        }
      })
    } else {
      this._ecommerceService.addToWishlist(product.id).then(res => {
        product.isInWishlist = true;
        console.log(res);
      })
    }
}

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  ngOnInit(): void {}
}
