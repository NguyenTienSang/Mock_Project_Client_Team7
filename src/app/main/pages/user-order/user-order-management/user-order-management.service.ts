import { filter } from 'rxjs/operators';
// import { environment } from './../../../../environments/environment.hmr';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
// import { CategoryUI } from './ui-models/Categories/CategoryUI';
import {tap} from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserOrderManagementService  {

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

  private currentId= JSON.parse(localStorage.getItem("currentUser")).user.id;


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


  constructor(private _httpClient: HttpClient) {

  }





  getOrderUser(idUser: string): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiUrl}/api/Order/GetOrderUser/${idUser}`)
  };


}
