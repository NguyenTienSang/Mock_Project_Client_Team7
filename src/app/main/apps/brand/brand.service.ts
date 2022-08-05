import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private _httpClient: HttpClient) { }

  getBrand():Observable<any>{
    return this._httpClient.get<any>(`${environment.apiUrl}/api/Brand/GetAllBrand`);
  }

  addBrand(brandForCreate: any):Observable<any>{
    return this._httpClient.post(`${environment.apiUrl}/api/Brand/CreateBrand`, brandForCreate);
  }

  updateBrand(id:number, brandForUpdate:any):Observable<any>{
    return this._httpClient.put(`${environment.apiUrl}/api/Brand/UpdateBrand/${id}`, brandForUpdate);
  }

  deleteBrand(id:number):Observable<any>{
    return this._httpClient.delete(`${environment.apiUrl}/api/Brand/DeleteBrand/${id}`);
  }
}
