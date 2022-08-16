import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import Swal  from 'sweetalert2/dist/sweetalert2.js';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ecommerce-details',
  templateUrl: './ecommerce-details.component.html',
  styleUrls: ['./ecommerce-details.component.scss'],
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
export class EcommerceDetailsComponent implements OnInit {
  productId: string | null |  undefined;
  // public
  public contentHeader: object;
  public product;
  public wishlist;
  public cartList;
  public relatedProducts;
  public selectedProduct;
  public role: boolean;
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  public isRating;
  public ratingProduct ;
  public rating;
  public notificationRating;

  datePipe: DatePipe = new DatePipe('en-US');
  currentDate = new Date();
  transformDate= this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');


  // Swiper
  public swiperResponsive: SwiperConfigInterface = {
    slidesPerView: 3,
    spaceBetween: 50,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      1024: {
        slidesPerView: 3,
        spaceBetween: 40
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 10
      }
    }
  };

  /**
   * Constructor
   *
   * @param {EcommerceService} _ecommerceService
   */
  constructor(private _ecommerceService: EcommerceService, private readonly route: ActivatedRoute) {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Wishlist
   *
   * @param product
   */
  toggleWishlist(selectedProduct) {
    if (selectedProduct.isInWishlist === true) {
      Swal.fire({
        title: 'Are you sure want to remove?',
        text: 'You will not be able to recover this file!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this._ecommerceService.removeFromWishlist(selectedProduct.id).subscribe((res=>{
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
      this._ecommerceService.addToWishlist(selectedProduct.id).subscribe(res => {
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
  addToCart(selectedProduct) {
    console.log('test');

    this._ecommerceService.totalPriceCart += selectedProduct.price;
    this._ecommerceService.addToCart(selectedProduct.id).then(res => {
      selectedProduct.isInCart = true;
    });
  }
  deleteProduct(id: number){
    console.log("id product", id);
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._ecommerceService.deleteProduct(id).subscribe(respone=>{
          console.log("delete",respone);
          if(respone.isSuccessed){
            Swal.fire("Success",respone.message,"success")
            window.location.href = "/apps/e-commerce/product-delete";
          }
          else{
            Swal.fire("Error",respone.message,"error")
          }
        },(error=>{
          Swal.fire("Error",error,"error")
        })
        );
      }
      // else if (result.dismiss === Swal.DismissReason.cancel) {
      //   Swal.fire(
      //     'Cancelled',
      //     'Your imaginary file is safe :)',
      //     'error'
      //   )
      // }
    })
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
   

    this.ratingProduct = 3.5
    this.rating = 0;

    let Id;

    this.role = false;
    if(this.currentUser != null){
      let roleUser = this.currentUser.user.role;
      if(roleUser == "Master" || roleUser == "Mod")
      {
        this.role = true;
        this.isRating = false;
      }
      else
        this.isRating = true;
    }

    // Subscribe to Selected Product change
    this._ecommerceService.onSelectedProductChange.subscribe(res => {
      this.selectedProduct = res[0];

    });


    // Subscribe to Wishlist change
    this._ecommerceService.onWishlistChange.subscribe(res => (this.wishlist = res));

    // Subscribe to Cartlist change
    this._ecommerceService.onCartListChange.subscribe(res => (this.cartList = res));

    // Get Related Products
    this._ecommerceService.getRelatedProducts().then(response => {
      this.relatedProducts = response;
    });
    this.route.paramMap.subscribe((params)=>{
      this.productId = params.get('id');
      if(this.productId){
        this._ecommerceService.getSelectedProduct(this.productId)
          .subscribe((respone)=>{
            this.selectedProduct = respone.resultObj;
            Id = this.selectedProduct.id;
            console.log("id", Id);

            this._ecommerceService.getRating(this.selectedProduct.id).subscribe((res=>{
              if(res.isSuccessed && res.resultObj.userId == this.currentUser.user.id)
              {
                this.rating = res.resultObj.rate;
                if(res.resultObj.updatedDate!= null)
                  this.notificationRating = "You are rated at "+ res.resultObj.updatedDate.substring(0,10);
                else
                  this.notificationRating = "You are rated at "+ res.resultObj.createdDate.substring(0,10);
              }
              else{
                this.rating = 0;
                this.notificationRating = null;
              }
            }))
          })
      }
    });
    this.selectedProduct.isInWishlist = this.wishlist.findIndex(p => p.productId === this.selectedProduct.id) > -1;
    this.selectedProduct.isInCart = this.cartList.findIndex(p => p.productId === this.selectedProduct.id) > -1;



    // content header
    this.contentHeader = {
      headerTitle: 'Product Details',
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
            name: 'Shop',
            isLink: true,
            link: '/'
          },
          {
            name: 'Details',
            isLink: false
          }
        ]
      }
    };
  }

  SaveRating(productId){
    let ratingCreateViewModel = {
      productId: productId,
      userId: this.currentUser.user.id,
      rate: this.rating,
      createdDate: this.transformDate,
      createdBy: this.currentUser.user.userName
    }
    console.log("rating: ", ratingCreateViewModel);

    this._ecommerceService.addRating(ratingCreateViewModel).subscribe((res=>{
      console.log("response: ", res);
      if(res.isSuccessed)
      {
        Swal.fire("Success", res.message, "success");
        this.route.paramMap.subscribe((params)=>{
          this.productId = params.get('id');
          if(this.productId){
            this._ecommerceService.getSelectedProduct(this.productId)
              .subscribe((respone)=>{
                this.selectedProduct = respone.resultObj;
                let Id = this.selectedProduct.id;
                console.log("id", Id);
                
                this._ecommerceService.getRating(this.selectedProduct.id).subscribe((res=>{
                  if(res.isSuccessed && res.resultObj.userId == this.currentUser.user.id)
                  {
                    this.rating = res.resultObj.rate;
                    if(res.resultObj.updatedDate!= null)
                      this.notificationRating = "You are rated at "+ res.resultObj.updatedDate.substring(0,10);
                    else
                      this.notificationRating = "You are rated at "+ res.resultObj.createdDate.substring(0,10);
                  }
                  else{
                    this.rating = 0;
                    this.notificationRating = null;
                  }
                }))
              })
          }
        });
        // this._ecommerceService.getRating(this.selectedProduct.id).subscribe((res=>{
        //   if(res.isSuccessed && res.resultObj.userId == this.currentUser.user.id)
        //   {
        //     this.rating = res.resultObj.rate;
        //     if(res.resultObj.updatedDate!= null)
        //       this.notificationRating = "You are rated at "+ res.resultObj.updatedDate.substring(0,10);
        //     else
        //       this.notificationRating = "You are rated at "+ res.resultObj.createdDate.substring(0,10);
        //   }
        //   else{
        //     this.rating = 0;
        //     this.notificationRating = null;
        //   }
        // }))
      }
      else
        Swal.fire("Error", res.message, "error");
    }))
  }
}
