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
      this._ecommerceService.removeFromCart(product.id).then(res => {
        product.isInCart = false;
      });
    }
  }



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
    // this._ecommerceService.onCartListChange.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this._ecommerceService.onCartListChange.subscribe(res => {
      this.cartList = res;
      this.cartListLength = this.cartList.length;
      this.totalPrice = 0;
      console.log('cart change');
      console.log('this.cartList : ',this.cartList);

      if(this.cartList.length > 0)
      {


        this.products.forEach(product => {
          product.isIncart = this.cartList?.some(p => p.productId === product.id);
            if(product.isIncart)
            {
              this.totalPrice+= product.price;
            }
      })
      }
    });

    // Subscribe to ProductList change
    this._ecommerceService.onProductListChange.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.products = res;

      if (this.products.length) {
        console.log('this.products 2 : ',this.products);
        // update product is in CartList : Boolean
        this.products.forEach(product => {
          product.isInCart = this.cartList.findIndex(p => p.productId === product.id) > -1;
        });
      }
    });
  }
}
