import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserOrderManagementItemService {

  constructor(private _httpClient: HttpClient) { }

  getOrderDetailUser(orderId : string): Observable<any>{
    return this._httpClient.get<any>(`${environment.apiUrl}/api/OrderDetail/GetAllOrderDetailByIdOrder/${orderId}`)
  }

}
