import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class EcommerceEditService  implements Resolve<any> {
  public apiData: any;
  public onDataChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onDataChanged = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getApiData()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get API Data
   */
  getApiData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/Products/GetAllProduct`).subscribe((response: any) => {
        this.apiData = response.resultObj;
        this.onDataChanged.next(this.apiData);
        resolve(this.apiData);
      }, reject);
    });
  }

  getCategory():Observable<any>{
    return this._httpClient.get<any>(`${environment.apiUrl}/api/Category/GetAllCategory`)
  }

  getBrand():Observable<any>{
    return this._httpClient.get<any>(`${environment.apiUrl}/api/Brand/GetAllBrand`)
  }

  updateProduct(product: any, id: number):Observable<any>{
    return this._httpClient.put<any>(`${environment.apiUrl}/api/Products/UpdateProduct/${id}`, product)
  }

  onUploadAvatar(id: number, formData: FormData):Observable<any>{

    return this._httpClient.post(`${environment.apiUrl}/api/Products/UploadImage/${id}`,formData)
  }
}
