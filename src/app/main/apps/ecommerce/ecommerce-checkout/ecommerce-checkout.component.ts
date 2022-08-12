import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import Stepper from 'bs-stepper';

import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';

@Component({
  selector: 'app-ecommerce-checkout',
  templateUrl: './ecommerce-checkout.component.html',
  styleUrls: ['./ecommerce-checkout.component.scss'],
//   styles: [`
//   h3 {
//     font-family: Lato;
//     text-align: center;
//     color:	#0080ff;
//   }
  
//   .circles{
//     height: 0.938em;
//     width: 0.938em;
//     border: 0.188em solid #000;
//     border-radius: 50%;
//     display: inline-block;
//   }
  
//   .active{
//       background-color:#ffa500;
//   }
  
//   .circle-desc-active{
//   font-weight: bold;
//   }
  
//   .bar{
//     width: 16%;
//     height: 0.063em;
//     margin-bottom:0.469em;
//     border: 0.031em solid #000;
//     color:#000;
//     background-color:#000;
//     display: inline-block;
//     text-align:center;
//     margin:"0 auto";
//   }
  
//   .container{
//     min-width:320px;
//     margin: "0px auto";
//     text-align: center;
//   }
  
//   .circle-desc{
//    position: absolute;
//    top:47.0em;
//    font-size: 1.125em;
//    width: auto;
//    max-width:9.375em;
//    margin-left:-0.750em;
//   }
// `],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' }
})
export class EcommerceCheckoutComponent implements OnInit {
  // Public
  public contentHeader: object;
  public products;
  public cartLists;
  public wishlist;

  public address = {
    fullNameVar: '',
    numberVar: '',
    flatVar: '',
    landmarkVar: '',
    cityVar: '',
    pincodeVar: '',
    stateVar: ''
  };

  // Private
  private checkoutStepper: Stepper;

  /**
   *  Constructor
   *
   * @param {EcommerceService} _ecommerceService
   */
  constructor(private _ecommerceService: EcommerceService) {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Stepper Next
   */
  nextStep() {
    this.checkoutStepper.next();
  }
  /**
   * Stepper Previous
   */
  previousStep() {
    this.checkoutStepper.previous();
  }

  /**
   * Validate Next Step
   *
   * @param addressForm
   */
  validateNextStep(addressForm) {
    if (addressForm.valid) {
      this.nextStep();
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to ProductList change
    this._ecommerceService.onProductListChange.subscribe(res => {
      this.products = res;

      this.products.isInWishlist = false;
    });

    // Subscribe to Cartlist change
    this._ecommerceService.onCartListChange.subscribe(res => (this.cartLists = res));
      console.log('this.cartLists : ',this.cartLists);

    // Subscribe to Wishlist change
    this._ecommerceService.onWishlistChange.subscribe(res => (this.wishlist = res));

    // update product is in Wishlist & is in CartList : Boolean
    this.products.forEach(product => {
      // product.isInWishlist = this.wishlist.findIndex(p => p.productId === product.id) > -1;
      product.isInCart = this.cartLists.findIndex(p => p.productId === product.id) > -1;
      if(product.isInCart)
      {
        console.log('product ; ',product);

      }
    });

    this.checkoutStepper = new Stepper(document.querySelector('#checkoutStepper'), {
      linear: false,
      animation: true
    });

    // content header
    this.contentHeader = {
      headerTitle: 'Checkout',
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
            name: 'Checkout',
            isLink: false
          }
        ]
      }
    };
  }

  // //progress bar
  // name = 'Progress Bar';

  // //Demo purpose only, Data might come from Api calls/service
  // public counts = [
  //   'Recieved',
  //   'In Progress',
  //   'Ready for Billing',
  //   'Billed',
  //   'Order Closed',
  // ];
  // public orderStatus = 'Order Closed';
}
