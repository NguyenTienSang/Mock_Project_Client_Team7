import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class EcommerceManagerService implements Resolve<any> {
  public rows: any;
  public onDatatablessChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onDatatablessChanged = new BehaviorSubject({});
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
      Promise.all([this.getDataTableRows()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get rows
   */
  getDataTableRows(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/Products/GetAllProduct`).subscribe((response: any) => {
        this.rows = response.resultObj;
        this.onDatatablessChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }

  getCategory():Observable<any>{
    return this._httpClient.get<any>(`${environment.apiUrl}/api/Category/GetAllCategory`)
  }

  getBrand():Observable<any>{
    return this._httpClient.get<any>(`${environment.apiUrl}/api/Brand/GetAllBrand`)
  }

  createProduct(product: any):Observable<any>{
    return this._httpClient.post<any>(`${environment.apiUrl}/api/Products/CreateProduct`, product)
  }

  onUploadAvatar(id: number, formData: FormData):Observable<any>{
    
    return this._httpClient.post(`${environment.apiUrl}/api/Products/UploadImage/${id}`,formData)
  }

  deleteProduct(id: number):Observable<any>{
    return this._httpClient.delete(`${environment.apiUrl}/api/Products/DeleteProduct/${id}`)
  }

  addCategory(categoryForCreate: any):Observable<any>{
    console.log("name", categoryForCreate);
    
    return this._httpClient.post(`${environment.apiUrl}/api/Category/CreateCategory`, categoryForCreate);
  }

  addBrand(brandForCreate: any):Observable<any>{
    return this._httpClient.post(`${environment.apiUrl}/api/Brand/CreateBrand`, brandForCreate);
  }
}