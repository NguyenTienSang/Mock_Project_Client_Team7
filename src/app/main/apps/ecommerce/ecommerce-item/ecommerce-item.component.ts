import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import Swal  from 'sweetalert2';
import { EcommerceWishlistComponent } from '../ecommerce-wishlist/ecommerce-wishlist.component';

@Component({
  selector: 'app-ecommerce-item',
  templateUrl: './ecommerce-item.component.html',
  styleUrls: ['./ecommerce-item.component.scss'],
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
      product.isInWishlist = true;
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
    console.log('test');

    this._ecommerceService.totalPriceCart += product.price;
    this._ecommerceService.totalPriceCart = Number(this._ecommerceService.totalPriceCart.toFixed(2));
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
