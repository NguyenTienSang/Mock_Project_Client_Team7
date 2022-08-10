import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import Swal  from 'sweetalert2';

@Component({
  selector: 'app-ecommerce-item',
  templateUrl: './ecommerce-item.component.html',
  styleUrls: ['./ecommerce-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' }
})
export class EcommerceItemComponent implements OnInit {
  // Input Decorotor
  @Input() product;
  @Input() isWishlistOpen = false;

  // Public
  public isInCart = false;
  // public totalPrice = 0;
  /**
   *
   * @param {EcommerceService} _ecommerceService
   */
  constructor(private _ecommerceService: EcommerceService) {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Wishlist
   *
   * @param product
   */
  toggleWishlist(product) {
    if (product.isInWishlist === true) {
      this._ecommerceService.removeFromWishlist(product.id).then(res => {
        product.isInWishlist = false;
        console.log(res);
      });
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

  /**
   * Add To Cart
   *
   * @param product
   */
  addToCart(product) {
    console.log('product : ',product);

    this._ecommerceService.addToCart(product.id).then(res => {
      product.isInCart = true;
      product.quantityInCart = 1;
      // this._navbarCartComponent.totalPrice+= product.price;
      // this.totalPrice+= product.price;
    });
  }




  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  ngOnInit(): void {}
}
