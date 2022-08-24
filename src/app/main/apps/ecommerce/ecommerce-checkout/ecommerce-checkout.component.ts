import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import Stepper from 'bs-stepper';
import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import { AccountSettingsService } from 'app/main/pages/account-settings/account-settings.service';

import Swal  from 'sweetalert2';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ecommerce-checkout',
  templateUrl: './ecommerce-checkout.component.html',
  styleUrls: ['./ecommerce-checkout.component.scss'],
  styles: [`

  * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}
.container-voucher{
  width: 100%;
  height: 200px;
  justify-content: left;
  align-items: left;
  display: flex;
  background-color: #00bfa5;
  border-radius: 5px;
}

.card-voucher {
  height: 180px;
  border-radius: 5px;
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.2);
  background-color: #fff;
  position: relative;
  margin-top: 10px;
  margin-left: 10px;
}

.main-voucher {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  height: 180px;
  align-items: center;
}

.card-voucher::before {
  position: absolute;
  content: "";
  height: 40px;
  left: -12px;
  border-radius: 40px;
  z-index: 1;
  top: 70px;
  background-color: #00bfa5;
  width: 40px;
}

.co-img img {
  width: 100px;
  height: 100px;
}
.vertical-voucher {
  border-left: 5px dotted black;
  height: 100px;
}

.content-voucher h1 {
  font-size: 35px;
  color: #565656;
}

.content-voucher h1 span {
  font-size: 18px;
}
.content-voucher h2 {
  font-size: 18px;
  color: #565656;
  text-transform: uppercase;
}

.content-voucher p {
  font-size: 16px;
  color: #696969;
}

  `],
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
  closeResult: string;

  // voucher
  public vouchers ;
  public selectedVoucher;
  public isSelectedVoucher: boolean;
  voucherSelectedId: any;
  public totalPriceFinal;
  isAddVoucher: boolean;

  datePipe: DatePipe = new DatePipe('en-US');
  currentDate = new Date();
  transformDate= this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');

  /**
   *  Constructor
   *
   * @param {EcommerceService} _ecommerceService
   */
  constructor(private _accountSettingsService: AccountSettingsService,
    private _ecommerceService: EcommerceService,
    private modalService:NgbModal) {

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

    let createOrderViewModel;
    if(this.selectedVoucher != null){
      createOrderViewModel = {
        name : this.address.fullNameVar,
        createdBy : createdBy,
        updatedDate : orderDate,
        updatedBy : createdBy,
        status : "Awaiting Accept Order",
        voucherId: this.selectedVoucher.id,
        shipAddress : this.address.addressVar,
        shipPhoneNumber : this.address.numberVar,
        // orderDate : orderDate
      }
    }
    else{
      createOrderViewModel = {
        name : this.address.fullNameVar,
        createdBy : createdBy,
        updatedDate : orderDate,
        updatedBy : createdBy,
        status : "Awaiting Accept Order",
        shipAddress : this.address.addressVar,
        shipPhoneNumber : this.address.numberVar,
        // orderDate : orderDate
      }
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
                  // createOrderDetailViewModel.price = Number((product.price - (product.price * product.discount*0.01)).toFixed(2));
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
      this.totalPrice = Number(this._ecommerceService.totalPriceCart.toFixed(2));

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
        this._ecommerceService.onWishlistChange.subscribe(res => (this.wishlist = res));

          this.products.forEach(product => {
          product.isInWishlist = this.wishlist.findIndex(p => p.id === product.id) > -1;
        });
      }


    // update product is in Wishlist & is in CartList : Boolean

    // this.products.forEach(product => {
    //   product.isInCart = this.cartLists.findIndex(p => p.productId === product.id) > -1;
    //   if(product.isInCart)
    //   {
    //     console.log('product ; ',product);
    //     this.totalPrice = this._ecommerceService.totalPriceCart ;
    //     // this.totalPrice+=product.price * product.quantityInCart;
    //   }
    //   // this.totalPrice = Number(this.totalPrice.toFixed(2));
    //   // this._ecommerceService.totalPriceCart = this.totalPrice;
    // });

    this.totalPrice = Number(this._ecommerceService.totalPriceCart.toFixed(2)) ;


    this.checkoutStepper = new Stepper(document.querySelector('#checkoutStepper'), {
      linear: false,
      animation: true
    });

    this.isSelectedVoucher = false;

    this._ecommerceService.getAllVouchers().subscribe((res=>{
      this.vouchers = res.resultObj;
      this.vouchers.forEach(voucher =>{
        voucher.expiredDate = voucher.expiredDate.substring(0,10);
      })
      console.log(this.vouchers);
      
    }))

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

  // voucher
  open(content) {
    this.isAddVoucher = false;
    console.log("now", this.transformDate);
    
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size:'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    this.isSelectedVoucher = false;
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  addVoucher(voucherId){
    this.isAddVoucher = false;
    this.voucherSelectedId = voucherId;
    if(this.voucherSelectedId != null){
      this._ecommerceService.getVoucherbyId(this.voucherSelectedId).subscribe((res=>{
        this.selectedVoucher = res.resultObj;
        this.isSelectedVoucher = true;
        this.totalPriceFinal = Number((this._ecommerceService.totalPriceCart - this.selectedVoucher.discount).toFixed(2)) ;
        if(this.totalPriceFinal < 0)
          this.totalPriceFinal = 0;
      }))
    }
  }

  addVoucherOrder(){
    if(this.voucherSelectedId != null){
      this._ecommerceService.getVoucherbyId(this.voucherSelectedId).subscribe((res=>{
        this.selectedVoucher = res.resultObj;
        this.isSelectedVoucher = true;
        console.log("OK voucher ", this.selectedVoucher);
        if(this.totalPrice >= this.selectedVoucher.conditionDiscount){
          Swal.fire("Success", "Add voucher successfully", "success")
          this.totalPriceFinal = Number((this._ecommerceService.totalPriceCart - this.selectedVoucher.discount).toFixed(2)) ;
          if(this.totalPriceFinal < 0)
            this.totalPriceFinal = 0;
          this.isAddVoucher = true;
        }
        else{
          Swal.fire("Error", "Valid for orders of %"+this.selectedVoucher.conditionDiscount+" or more.", "error")
        }
      }))
    }
    // Swal.fire("Success", "Add voucher successfully", "success")
    
  }

  // CloseVoucher(){
  //   this.modalService.dismissAll('Save click');
  //   // this.selectedVoucher = null;
  //   // this.isSelectedVoucher = false;
  // }
}
