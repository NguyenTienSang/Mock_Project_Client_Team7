import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import Stepper from 'bs-stepper';
import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import { AccountSettingsService } from 'app/main/pages/account-settings/account-settings.service';

import Swal  from 'sweetalert2';
@Component({
  selector: 'app-ecommerce-checkout',
  templateUrl: './ecommerce-checkout.component.html',
  styleUrls: ['./ecommerce-checkout.component.scss'],

  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' }
})
export class EcommerceCheckoutComponent implements OnInit {
  // Public
  public contentHeader: object;
  public products;
  public cartLists;
  public wishlist;
  public userID = JSON.parse(localStorage.getItem('currentUser'))?.user?.id;
  public contacts;
  public totalPrice = 0;
  public disableOrder = false;


  public address = {
    fullNameVar: '',
    numberVar: '',
    addressVar: '',
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


                    if(res.isSuccessed) {
                      product.isInCart = false;
                    }
                    else if(!res.isSuccessed)
                      {
                        countOrderDetail = false;
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

                  if(res.isSuccessed)
                  {
                    Swal.fire("Success","Order created successfully","success")
                  }
                  else {
                    countOrderDetail = false;
                  }
              })
          }
          else {
            console.log('Order fail please rollback order');
          }
        }
        else{
          Swal.fire("Error",res.message,"error")
        }
    })
  }

  // getUserContact(id : string)
  // {
  //   this._accountSettingsService.getUserContact(id).subscribe(respone=>{
  //     this.contacts = respone.resultObj;
  //   })
  // }



  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {

    if(this.userID){
      this._accountSettingsService.getUserContact(
        this.userID
      ).subscribe((response)=>{
        this.contacts = response.resultObj;
        this.contacts.forEach(itemContact => {
            if(itemContact.default)
            {
              this.address.fullNameVar = itemContact.fullName;
              this.address.addressVar = itemContact.address;
              this.address.numberVar = itemContact.phoneNumber;
            }
        });
      },(err) =>{
        console.log(err);
      })
    }


    // Subscribe to ProductList change
    this._ecommerceService.onProductListChange.subscribe(res => {
      this.products = res;
      this.products.isInWishlist = false;
    });

    // Subscribe to Cartlist change
    this._ecommerceService.onCartListChange.subscribe(res => {
      this.cartLists = res;
      if(this.cartLists.length)
      {
        this.disableOrder = false;
      }
      else {
        this.disableOrder = true;
      }
      this.totalPrice = this._ecommerceService.totalPriceCart;
    });

      if(this.cartLists.length)
      {
        this.disableOrder = false;
      }
      else {
        this.disableOrder = true;
      }


      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if(currentUser)
      {
        this._ecommerceService.getWishlists().subscribe(res => {

          this.wishlist = res.resultObj;

          this.products.forEach(product => {

            product.isInWishlist = this.wishlist.findIndex(p => p.id == product.id) > -1;

          });

        });
      }



    // Subscribe to Wishlist change
    // this._ecommerceService.getWishlists().subscribe(res => {

    //   this.wishlist = res.resultObj;

    //   this.products.forEach(product => {

    //     product.isInWishlist = this.wishlist.findIndex(p => p.id == product.id) > -1;

    //   });

    // });

    // update product is in Wishlist & is in CartList : Boolean

    this.products.forEach(product => {
      product.isInCart = this.cartLists.findIndex(p => p.productId === product.id) > -1;
      if(product.isInCart)
      {
        console.log('product ; ',product);
        this.totalPrice = this._ecommerceService.totalPriceCart ;
        // this.totalPrice+=product.price * product.quantityInCart;
      }
      // this.totalPrice = Number(this.totalPrice.toFixed(2));
      // this._ecommerceService.totalPriceCart = this.totalPrice;
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
