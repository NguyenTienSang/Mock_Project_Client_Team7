import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserOrderDetailService {

  constructor(private _httpClient: HttpClient) { }

  
  getOrderById(id: number): Observable<any>{
    return this._httpClient.get(`${environment.apiUrl}/api/Order/GetOrder/${id}`);
  }

  getAllOrderDetailByOrderId(idOrder: number): Observable<any>{
    return this._httpClient.get(`${environment.apiUrl}/api/OrderDetail/GetAllOrderDetailByIdOrder/${idOrder}`);
  }
}
