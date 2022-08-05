import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import Swal  from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-ecommerce-details',
  templateUrl: './ecommerce-details.component.html',
  styleUrls: ['./ecommerce-details.component.scss'],
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
      this._ecommerceService.removeFromWishlist(selectedProduct.id).then(res => {
        selectedProduct.isInWishlist = false;
      });
    } else {
      this._ecommerceService.addToWishlist(selectedProduct.id).then(res => {
        selectedProduct.isInWishlist = true;
      });
    }
  }

  /**
   * Add To Cart
   *
   * @param product
   */
  addToCart(selectedProduct) {
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
    this.role = false;
    if(this.currentUser != null){
      let roleUser = this.currentUser.user.role;
      if(roleUser == "Master" || roleUser == "Mod")
        this.role = true;  
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
}
