import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import Stepper from 'bs-stepper';
import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import { AccountSettingsService } from 'app/main/pages/account-settings/account-settings.service';
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
    addressVar: '',
    // landmarkVar: '',
    // cityVar: '',
    // pincodeVar: '',
    // stateVar: ''
  };

  // Private
  private checkoutStepper: Stepper;

  /**
   *  Constructor
   *
   * @param {EcommerceService} _ecommerceService
   */
  constructor(private _accountSettingsService: AccountSettingsService,private _ecommerceService: EcommerceService) {

  }

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

  createOrder(){
    const createdBy = JSON.parse(localStorage.getItem('currentUser')).user.id;
    var today = new Date();
    const orderDate = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' +  String(today.getDate()).padStart(2, '0');

    let createOrderViewModel = {
      name : this.address.fullNameVar,
      createdBy : createdBy,
      updatedDate : orderDate,
      updatedBy : createdBy,
      status : "Awaiting Accept Order",
      shipAddress : this.address.addressVar,
      shipPhoneNumber : this.address.numberVar,
      // orderDate : orderDate
    }

    this._ecommerceService.createOrder(createOrderViewModel).subscribe(res => {
        console.log('res : ',res);
        if(res.isSuccessed)
        {
          let createOrderDetailViewModel = {
            orderId: res.resultObj.id,
            productId: "",
            price: 0,
            quantity: 1,
            discount: 0,
            createdBy: res.resultObj.createdBy,
            updatedDate: res.resultObj.updatedDate,
            updatedBy: res.resultObj.updatedBy
          }

          let countOrderDetail = true;

          this.products.forEach(product => {

            this.cartLists.forEach(itemCart => {
                if(itemCart.productId === product.id)
                {

                  createOrderDetailViewModel.productId = itemCart.productId;
                  createOrderDetailViewModel.price = product.price;
                  createOrderDetailViewModel.quantity = itemCart.quantity;

                  this._ecommerceService.createOrderDetail(createOrderDetailViewModel, product).subscribe(res => {

                    console.log('Show response createOrderDetail : ',res);

                    console.log('View product after : ',product);
                    if(res.isSuccessed) {
                      product.isInCart = false;
                      console.log('set cart false');
                    }
                    else if(!res.isSuccessed)
                      {
                        countOrderDetail = false;
                        console.log('set countOrderDetail = false');
                      }
                  })
                }
            })
          });

          if(countOrderDetail)
          {
              console.log('countOrderDetail : ',countOrderDetail);

                console.log('Order successfull and remove cart');
                this._ecommerceService.deleteListCartUser().subscribe(res => {
                  console.log('res deleteListCartUser',res);

                  if(!res.isSuccessed)
                  {
                    countOrderDetail = false;
                  }
              })
          }
          else {
            console.log('Order fail please rollback order');
          }
        }
    })
  }


  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {

    this.address.addressVar = "Địa chỉ nè";
    this.address.fullNameVar = "Tên nè";
    this.address.numberVar = "SĐT nè";
    const userID = JSON.parse(localStorage.getItem('currentUser')).user.id;

    console.log('userID  :',userID);

    this._accountSettingsService.getUserContact(
      userID
    ).subscribe((response)=>{
      // this.contactEdit = response.resultObj;
      console.log('response.resultObj[0] : ',response.resultObj[0]);

      this.address.fullNameVar = response.resultObj[0].fullName;
      this.address.addressVar = response.resultObj[0].address;
      this.address.numberVar = response.resultObj[0].phoneNumber;
    },(err) =>{
      console.log(err);
    })



    // Subscribe to ProductList change
    this._ecommerceService.onProductListChange.subscribe(res => {
      this.products = res;

      this.products.isInWishlist = false;
    });

    // Subscribe to Cartlist change
    this._ecommerceService.onCartListChange.subscribe(res => (this.cartLists = res));
      console.log('this.cartLists : ',this.cartLists);

    // Subscribe to Wishlist change
    this._ecommerceService.getWishlists().subscribe(res => {

      this.wishlist = res.resultObj;

      this.products.forEach(product => {

        product.isInWishlist = this.wishlist.findIndex(p => p.id == product.id) > -1;

      });

    });

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
