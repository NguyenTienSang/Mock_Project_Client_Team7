import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import {NavbarCartComponent} from 'app/layout/components/navbar/navbar-cart/navbar-cart.component';

import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';



@Component({
  selector: 'core-touchspin',
  templateUrl: './core-touchspin.component.html',
  styleUrls: ['./core-touchspin.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CoreTouchspinComponent implements OnInit {
  @Input('numberValue') numberValue = 0;

  @Input('iconChevron') iconChevron = false;
  @Input('disable') disabledValue = false;
  @Input('size') size: string = '';
  @Input('color') color: string = '';
  @Input('stepValue') stepValue: number;
  @Input('maxValue') maxValue: number = 9999;
  @Input('minValue') minValue: number = 1;

  @Input() product;

  public disabledValueIncrement = false;
  public disabledValueDecrement = false;

  // constructor(public _navbarCartComponent : NavbarCartComponent,public _ecommerceService: EcommerceService) {}
  constructor(public _ecommerceService: EcommerceService) {}

  inputChange(inputValue: number) {
    if (inputValue == this.maxValue || inputValue > this.maxValue) {
      this.disabledValueIncrement = true;
    } else {
      this.disabledValueIncrement = false;
    }
    if (inputValue == this.minValue || inputValue < this.minValue) {
      this.disabledValueDecrement = true;
    } else {
      this.disabledValueDecrement = false;
    }
  }

  increment(product) {
    console.log('product',product);
      // console.log('this._navbarCartComponent.totalPrice : ',this._navbarCartComponent.totalPrice);

      // this._navbarCartComponent.totalPrice+= product.price;
      product.quantityInCart++;
      this._ecommerceService.totalPriceCart +=  product.price;
      this._ecommerceService.totalPriceCart = Number(this._ecommerceService.totalPriceCart.toFixed(2));



    if (this.stepValue == undefined) {
      this.numberValue += 1;
    } else {
      this.numberValue += this.stepValue;
    }

    if (!(this.minValue == undefined || this.maxValue == undefined)) {
      if (this.numberValue == this.maxValue || this.numberValue > this.maxValue) {
        this.disabledValueIncrement = true;
      } else {
        this.disabledValueIncrement = false;
      }
      if (this.numberValue > this.minValue) {
        this.disabledValueDecrement = false;
      } else {
        this.disabledValueDecrement = true;
      }
    }

    this._ecommerceService.updateCart(product.id,this.numberValue);

    console.log('increase');
  }

  decrement(product) {

    product.quantityInCart--;
    this._ecommerceService.totalPriceCart -=  product.price;
    this._ecommerceService.totalPriceCart = Number(this._ecommerceService.totalPriceCart.toFixed(2));

    if (this.stepValue == undefined) {
      this.numberValue -= 1;
    } else {
      this.numberValue -= this.stepValue;
    }

    if (!(this.minValue == undefined || this.maxValue == undefined)) {
      if (this.numberValue == this.minValue || this.numberValue < this.minValue) {
        this.disabledValueDecrement = true;
      } else {
        this.disabledValueDecrement = false;
      }
      if (this.numberValue < this.maxValue) {
        this.disabledValueIncrement = false;
      } else {
        this.disabledValueIncrement = true;
      }
    }

    this._ecommerceService.updateCart(product.id,this.numberValue);


    console.log('decrease');

  }

  ngOnInit(): void {
    // this.disabledValueIncrement = this.disabledValue;
    // this.disabledValueDecrement = this.disabledValue;
    this.disabledValueIncrement = this.disabledValue;

    if(this.numberValue == this.minValue)
    {
      this.disabledValueDecrement = true;
    }

  }
}
