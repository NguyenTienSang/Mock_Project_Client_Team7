import { filter } from 'rxjs/operators';
// import { environment } from './../../../../environments/environment.hmr';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { CategoryUI } from './ui-models/Categories/CategoryUI';

@Injectable({
  providedIn: 'root'
})
export class EcommerceService implements Resolve<any> {
  // Public
  public productList: Array<any>;
  public brandList:Array<any>;
  public wishlist: Array<any>;
  public cartList: Array<any>;
  public selectedProduct;
  public relatedProducts;
  public categoryList: Array<any>;


  public onProductListChange: BehaviorSubject<any>;
  public onCategoryListChange: BehaviorSubject<any>;
  public onBrandListChange:BehaviorSubject<any>;
  public onRelatedProductsChange: BehaviorSubject<any>;
  public onWishlistChange: BehaviorSubject<any>;
  public onCartListChange: BehaviorSubject<any>;
  public onSelectedProductChange: BehaviorSubject<any>;


  // Private
  private idHandel;
  private productId;


  private sortRef = key => (a, b) => {
    const fieldA = a[key];
    const fieldB = b[key];

    let comparison = 0;
    if (fieldA > fieldB) {
      comparison = 1;
    } else if (fieldA < fieldB) {
      comparison = -1;
    }
    return comparison;
  };

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    this.onProductListChange = new BehaviorSubject({});
    this.onCategoryListChange = new BehaviorSubject({});
    this.onBrandListChange= new BehaviorSubject({});
    this.onSelectedProductChange = new BehaviorSubject({});
    this.onRelatedProductsChange = new BehaviorSubject({});
    this.onWishlistChange = new BehaviorSubject({});
    this.onCartListChange = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    this.idHandel = route.params.id;

    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getProducts(), this.getListCategory(),this.getBrandLists(), this.getWishlist(), this.getCartList(), this.getSelectedProduct(this.productId)]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get Products
   */
  getProducts(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/Products/GetAllProduct`).subscribe((response: any) => {
        this.productList = response.resultObj;
        // console.log('response : ',response);

        this.sortProduct('featured'); // Default shorting
        resolve(this.productList);
      }, reject);
    });
  }
  updateProduct(productId: string, productList: any): Observable<any>{
    return this._httpClient.put<any>(`${environment.apiUrl}/api/Products/UpdateProduct/` + productId, productList);
  }
  getBrandLists():Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/Brand/GetAllBrand`).subscribe((response: any) => {
        this.brandList=response.resultObj;
        // console.log('response : ',response);

        resolve(this.cartList);
      }, reject);
    });
  }

  /**
   * Get Wishlist
   */
  getWishlist(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/ecommerce-userWishlist').subscribe((response: any) => {
        this.wishlist = response;
        this.onWishlistChange.next(this.wishlist);
        resolve(this.wishlist);
      }, reject);
    });
  }

  /**
   * Get CartList
   */
  //Call api Get Cart

  getCartList(): Promise<any[]> {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if(currentUser)
      {
        return new Promise((resolve, reject) => {
          this._httpClient.get(`${environment.apiUrl}/api/Cart/user/${currentUser.user.id}`).subscribe((response: any) => {
            this.cartList = response.resultObj;
            this.onCartListChange.next(this.cartList);
            resolve(this.cartList);
          },reject);
        });
      }
      else {
        return new Promise((resolve, reject) => {
          const dataCart = sessionStorage.getItem('cart');
          if(dataCart != null)
          {
            this.cartList = JSON.parse(dataCart);
          }
          else {
            this.cartList = [];
          }
           //When cart list change
          this.onCartListChange.next(this.cartList);
          resolve(this.cartList);
        });
      }

  }






  getInitialCartList(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      // this._httpClient.get('api/ecommerce-userCart').subscribe((response: any) => {
      //   this._httpClient.get('api/ecommerce-userCart').subscribe((response: any) => {
      //   // this.cartList = response;
      //   this.cartList = [];
      //   //When cart list change
      //   this.onCartListChange.next(this.cartList);
      //   resolve(this.cartList);
      // }, reject);

      this.cartList = [];
      this.onCartListChange.next(this.cartList);
      resolve(this.cartList);
    });
  }

  /**
   * Get Selected Product
   */
  // getSelectedProduct(): Promise<any[]> {
  //   return new Promise((resolve, reject) => {
  //     this._httpClient.get('api/ecommerce-products?id=' + this.idHandel).subscribe((response: any) => {
  //       this.selectedProduct = response;
  //       this.onSelectedProductChange.next(this.selectedProduct);
  //       resolve(this.selectedProduct);
  //     }, reject);
  //   });
  // }
  getSelectedProduct(productId: string): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiUrl}/api/Products/GetProduct/` + productId);
  }
  /**
   * Get Related Products
   */
  getRelatedProducts(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/Products/GetAllProduct`).subscribe((response: any) => {
        this.relatedProducts = response;
        this.onRelatedProductsChange.next(this.relatedProducts);
        resolve(this.relatedProducts);
      }, reject);
    });
  }

  /**
   * Sort Product
   *
   * @param sortBy
   */
  sortProduct(sortBy) {
    let sortDesc = false;

    const sortByKey = (() => {
      if (sortBy === 'price-desc') {
        sortDesc = true;
        return 'price';
      }
      if (sortBy === 'price-asc') {
        return 'price';
      }
      sortDesc = true;
      return 'id';
    })();

    const sortedData = this.productList.sort(this.sortRef(sortByKey));
    if (sortDesc) sortedData.reverse();
    this.productList = sortedData;
    this.onProductListChange.next(this.productList);
  }

  /**
   * Add In Wishlist
   *
   * @param id
   */
  addToWishlist(id) {
    return new Promise<void>((resolve, reject) => {
      const lengthRef = this.wishlist.length + 1;
      const wishRef = { id: lengthRef, productId: id };

      this._httpClient.post('api/ecommerce-userWishlist/' + lengthRef, { ...wishRef }).subscribe(response => {
        this.getWishlist();
        resolve();
      }, reject);
    });
  }

  /**
   * Remove From Wishlist
   *
   * @param id
   */
  removeFromWishlist(id) {
    const indexRef = this.wishlist.findIndex(wishlistRef => wishlistRef.productId === id); // Get the index ref
    const indexId = this.wishlist[indexRef].id; // Get the product wishlist id from indexRef
    return new Promise<void>((resolve, reject) => {
      this._httpClient.delete('api/ecommerce-userWishlist/' + indexId).subscribe((response: any) => {
        this.getWishlist();
        resolve();
      }, reject);
    });
  }

  /**
   * Add In Cart
   *
   * @param id
   */
  addToCart(id) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(currentUser)
    {
      return new Promise<void>((resolve, reject) => {
        this._httpClient.post(`${environment.apiUrl}/api/Cart/add/${id}`,{
          id
        }).subscribe((response: any) => {
          this.getCartList();
          resolve();
          // this.cartList = response.resultObj;
          // this.onCartListChange.next(this.cartList);
          // resolve(this.cartList);
        }, reject);
      });
    }
    else {
      return new Promise<void>((resolve, reject) => {
        const dataCart = sessionStorage.getItem('cart');
    //Have cart in sessionStorage
        if(dataCart != null)
            {

              const lengthRef = JSON.parse(dataCart).length + 1;
              const cartRef = { id: lengthRef, productId: id, qty: 1 };
              const cart = JSON.parse(dataCart);
              const found = cart.find(item => item.productId == cartRef.productId);
              if(found != null)
              {
                //if found item then increase quantity item cart
                console.log('found item');
              }
              else
              {
                cart.push(cartRef);
                console.log('not found item');
              }
                sessionStorage.setItem('cart',JSON.stringify(cart));
            }
        //Haven't cart in sessionStorage
            else {
              // const lengthRef = JSON.parse(dataCart).length + 1;
              const cartRef = { id: 1, productId: id, qty: 1 };
              const cart = [];//Create new array cart empty
              cart.push(cartRef);
              sessionStorage.setItem('cart',JSON.stringify(cart));
            }
            this.getCartList();
            resolve();
      });
    }
  }

  /**
   * Remove From Cart
   *
   * @param id
   */
  removeFromCart(id) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(currentUser)
    {
      return new Promise<void>((resolve, reject) => {
        this._httpClient.delete(`${environment.apiUrl}/api/Cart/cart-delete/${id}`).subscribe((response: any) => {
          this.getCartList();
          resolve();
        }, reject);
      });
    }
    else {
      return new Promise<void>((resolve, reject) => {
        const dataCart = JSON.parse(sessionStorage.getItem('cart'));
        this.cartList = dataCart.filter((item) => item.productId != id)
        sessionStorage.setItem('cart',JSON.stringify(this.cartList));
              this.getCartList();
              resolve();
          });
    }



//  return new Promise<void>((resolve, reject) => {
//   const dataCart = JSON.parse(sessionStorage.getItem('cart'));
//   this.cartList = dataCart.filter((item) => item.productId != id)
//   sessionStorage.setItem('cart',JSON.stringify(this.cartList));
//         this.getCartList();
//         resolve();
//     });




  }

  // Get list Category
  getListCategory(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/Category/GetAllCategory`).subscribe((response: any) => {
        this.categoryList = response.resultObj;
        // console.log('response : ',response);
        resolve(this.categoryList);
      }, reject);
    });
  }
  deleteProduct(id: number):Observable<any>{
    return this._httpClient.delete(`${environment.apiUrl}/api/Products/DeleteProduct/${id}`)
  }

}
