import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

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

  /**
   * Constructor
   *
   * @param {EcommerceService} _ecommerceService
   */
  constructor(private _ecommerceService: EcommerceService) {}

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
      Swal.fire({
        title: 'Are you sure want to remove?',
        text: 'You will not be able to recover this file!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this._ecommerceService.removeFromWishlist(product.id).subscribe((res=>{
            if(res.isSuccessed){
              Swal.fire("Success",res.message,"success");
              window.location.reload();
            }
            else{
              Swal.fire("Warning",res.message,"warning");
            }
          }),
          (error=>{
            Swal.fire("Error",error,"error");
          })
          );
        } 
      })
    } else {
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
