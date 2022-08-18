import { filter } from 'rxjs/operators';
// import { environment } from './../../../../environments/environment.hmr';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { CategoryUI } from './ui-models/Categories/CategoryUI';
import Swal  from 'sweetalert2';
import {tap} from 'rxjs/operators';
import { map } from 'rxjs/operators';

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
  public totalPriceCart = 0;



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

  private currentId= JSON.parse(localStorage.getItem("currentUser"))?.user?.id;


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

        resolve(this.cartList);
      }, reject);
    });
  }

  /**
   * Get Wishlist
   */
  getWishlist(): Promise<any[]> {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if(currentUser)
    {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/Wishlist/user/${this.currentId}`).subscribe((response: any) => {
        this.wishlist = response.resultObj;
        this.onWishlistChange.next(this.wishlist);
        resolve(this.wishlist);
      }, reject);
    });
  }
  }

  // getWishlist(): Promise<any[]> {
  //   return new Promise((resolve, reject) => {
  //     this._httpClient.get(`${environment.apiUrl}/api/Wishlist/user/${this.currentId}`).subscribe((response: any) => {
  //       this.wishlist = response.resultObj;
  //       this.onWishlistChange.next(this.wishlist);
  //       resolve(this.wishlist);
  //     }, reject);
  //   });
  // }
  /**
   * Get CartList
   */
  //Call api Get Cart

  getCartList(): Promise<any[]> {
    this.currentId= JSON.parse(localStorage.getItem("currentUser"))?.user?.id;
    const dataCart = JSON.parse(sessionStorage.getItem('cart'));
    if(this.currentId)
    {

      // if(dataCart)
      // {
      //   dataCart.forEach(elementCart => {
      //     this.updateCart(elementCart.productId,elementCart.quantity);
      //   });
      //   sessionStorage.removeItem('cart');
      // }

      return new Promise((resolve, reject) => {
        this._httpClient.get(`${environment.apiUrl}/api/Cart/user/${this.currentId}`).subscribe((response: any) => {

          this.cartList = response.resultObj;
          this.onCartListChange.next(this.cartList);

          resolve(this.cartList);

        },reject);
      });
    }
    else {

    //Have cart in sessionStorage
      if(dataCart != null)
      {
        this.cartList = dataCart;
      }
    //Haven't cart in sessionStorage
      else {
    // const lengthRef = JSON.parse(dataCart).length + 1;
        this.cartList = [];
      }
      this.onCartListChange.next(this.cartList);
    }
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
      this._httpClient.post(`${environment.apiUrl}/api/Wishlist/add/${id}`,null).subscribe((res:any) => {
        this.getWishlist();
        if(res.isSuccessed){
          Swal.fire("Success",res.message,"success");
        }
        else{
          Swal.fire("Warning",res.message,"warning");
        }
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
    return new Promise<void>((resolve, reject) => {
      this._httpClient.delete(`${environment.apiUrl}/api/Wishlist/wishlst-delete/${id}`).subscribe((res: any) => {
        this.getWishlist();
        if(res.isSuccessed){
          Swal.fire("Success",res.message,"success");
        }
        else{
          Swal.fire("Warning",res.message,"warning");
        }
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
    //If login with account
    if(currentUser)
    {
      return new Promise((resolve, reject) => {
        this._httpClient.post(`${environment.apiUrl}/api/Cart/add/${id}`,{
          id
        }).subscribe((response: any) => {
          resolve(this.getCartList());
        }, reject);
      });
    }
    //If not login account
    else {
      return new Promise((resolve, reject) => {
        const dataCart = JSON.parse(sessionStorage.getItem('cart'));
      //Have cart in sessionStorage
        if(dataCart != null)
            {
              const lengthRef = dataCart.length + 1;
              const cartRef = { id: lengthRef, productId: id, quantity: 1 };
              const cart = dataCart;
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
                // this.cartList.push(cartRef);
              }
                sessionStorage.setItem('cart',JSON.stringify(cart));
            }
      //Haven't cart in sessionStorage
            else {
              this.cartList = [];
              const cartRef = { id: 1, productId: id, quantity: 1 };
              const cart = [];//Create new array cart empty
              cart.push(cartRef);
              sessionStorage.setItem('cart',JSON.stringify(cart));
            }

            // this.getCartList();
            resolve(this.getCartList());
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
    if(currentUser){
      return new Promise((resolve, reject) => {
        this._httpClient.delete(`${environment.apiUrl}/api/Cart/cart-delete/${id}`).subscribe((response: any) => {
          resolve( this.getCartList());
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






    // const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // if(currentUser)
    // {
    //   return new Promise<void>((resolve, reject) => {
    //     this._httpClient.delete(`${environment.apiUrl}/api/Cart/cart-delete/${id}`).subscribe((response: any) => {
    //       this.getCartList();
    //       resolve();
    //     }, reject);
    //   });
    // }
    // else {
    //   return new Promise<void>((resolve, reject) => {
    //     const dataCart = JSON.parse(sessionStorage.getItem('cart'));
    //     this.cartList = dataCart.filter((item) => item.productId != id)
    //     sessionStorage.setItem('cart',JSON.stringify(this.cartList));
    //           this.getCartList();
    //           resolve();
    //       });
    // }

  }


  updateCart(productId : string,quantity : number){
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(currentUser){
      return new Promise<void>((resolve, reject) => {
        this._httpClient.put<any>(`${environment.apiUrl}/api/Cart/cart-update`,{
          "productId" : productId,
          "userId" : this.currentId,
          "quantity" :  quantity
        }).subscribe((response: any) => {
          this.getCartList();
          resolve();
        }, reject);
      });
    }
    else {
      const dataCart = JSON.parse(sessionStorage.getItem('cart'));
        dataCart.forEach(p => {
            if(p.productId === productId)
            {
              p.quantity = quantity;
            }
        })

      // product.isInCart = this.cartList.findIndex(p => p.productId === product.id) > -1;

      this.getCartList();
      sessionStorage.setItem('cart',JSON.stringify(dataCart));
    }
  }


  // deleteListCartUser():Observable<any>{
  //   return this._httpClient.delete(`${environment.apiUrl}/api/Cart/delete-all-cart-user`).subscribe((response: any) => {
  //       this.getCartList();
  //       this.getToTalPrice();

  //     });

  // }

  deleteListCartUser():Observable<any> {

    return this._httpClient.delete<any>(`${environment.apiUrl}/api/Cart/delete-all-cart-user`).pipe(
      tap(()=>{

        this.getCartList();
        // this.getToTalPrice();
        this.totalPriceCart = 0;
      }
    ));
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

  addRating(ratingCreateViewModel: any):Observable<any>{
    return this._httpClient.post<any>(`${environment.apiUrl}/api/Rating/addRating`, ratingCreateViewModel)
  }

  getRating(productId: any):Observable<any>{
    return this._httpClient.get(`${environment.apiUrl}/api/Rating/getRating/${productId}`)
  }

  //Create Order
  createOrder(createOrderViewModel : any):Observable<any>{

    // console.log('createdByViewModel 2 : ',createOrderViewModel);

    return this._httpClient.post<any>(`${environment.apiUrl}/api/Order/CreateOrder`, createOrderViewModel)
  }

  createOrderDetail(createOrderDetailViewModel : any, product : any):Observable<any>{
   // product.isInCart = false;
    return this._httpClient.post<any>(`${environment.apiUrl}/api/OrderDetail/CreateOrderDetail`, createOrderDetailViewModel).pipe(tap(response =>{

    }))
  }


  // createOrderDetail(createOrderDetailViewModel : any, product : any): Promise<any[]> {
  //   return new Promise((resolve, reject) => {
  //     this._httpClient.post(`${environment.apiUrl}/api/Category/GetAllCategory`, createOrderDetailViewModel).pipe(tap(response =>{
  //       resolve(this.categoryList);
  //     }, reject))
  //   });
  // }
}

