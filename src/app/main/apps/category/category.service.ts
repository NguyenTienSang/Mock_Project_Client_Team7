import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  public _refreshCategory$=new Subject<void>();

  constructor(private _httpClient: HttpClient) { }

  getCategory():Observable<any>{
    return this._httpClient.get<any>(`${environment.apiUrl}/api/Category/GetAllCategory`).pipe(
      tap(()=>{
        this._refreshCategory$.next();
      }
    ));
  }

  addCategory(categoryForCreate: any):Observable<any>{
    console.log("name", categoryForCreate);
    return this._httpClient.post(`${environment.apiUrl}/api/Category/CreateCategory`, categoryForCreate);
  }

  updateCategory(id:number, categoryForUpdate:any):Observable<any>{
    return this._httpClient.put(`${environment.apiUrl}/api/Category/UpdateCategory/${id}`, categoryForUpdate);
  }

  deleteCategory(id:number):Observable<any>{
    return this._httpClient.delete(`${environment.apiUrl}/api/Category/DeleteCategory/${id}`);
  }
}
