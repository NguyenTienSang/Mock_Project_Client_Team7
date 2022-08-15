import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';

@Component({
  selector: 'app-navbar-cart',
  templateUrl: './navbar-cart.component.html'
})
export class NavbarCartComponent implements OnInit {
  // Public
  public products = [];
  public cartList = [];
  public cartListLength;
  public totalPrice = 0;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   *
   * @param {EcommerceService} _ecommerceService
   */
  constructor(public _ecommerceService: EcommerceService) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Remove From Cart
   *
   * @param product
   */
  removeFromCart(product) {
    if (product.isInCart === true) {

      this._ecommerceService.totalPriceCart -=  product.price*product.quantityInCart;
      this._ecommerceService.totalPriceCart = Number(this._ecommerceService.totalPriceCart.toFixed(2));

      this.totalPrice = this._ecommerceService.totalPriceCart;
      this._ecommerceService.removeFromCart(product.id).then<any>(res => {
        product.isInCart = false;
      });
    }
  }

  // getTotalPrice()
  // {
  //   return this._ecommerceService.getToTalPrice();
  // }


  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Get Products
    this._ecommerceService.getProducts();

    // Get Cart List
    this._ecommerceService.getCartList();

    // Subscribe to Cart List
    this._ecommerceService.onCartListChange.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.cartList = res;
      this.cartListLength = this.cartList?.length;
      this.totalPrice = this._ecommerceService.totalPriceCart;

      // console.log('onCartListChange : ');
    });

    // Subscribe to ProductList change
    this._ecommerceService.onProductListChange.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.products = res;


      if (this.products.length) {
        // update product is in CartList : Boolean
        this.totalPrice = 0;
        this.products.forEach(product => {
          this.cartList.forEach(p => {
              if(p.productId === product.id)
              {
                product.isInCart = true;
                product.quantityInCart = p.quantity;
                this.totalPrice+=product.price * product.quantityInCart;
              }
          })

        product.isInCart = this.cartList.findIndex(p => p.productId === product.id) > -1;
        });
        this.totalPrice = Number(this.totalPrice.toFixed(2));
        this._ecommerceService.totalPriceCart = this.totalPrice;
      }
    });
  }
}
