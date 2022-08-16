import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderManagementService {

  constructor(private _httpClient: HttpClient) { }

  getOrders(): Observable<any>{
    return this._httpClient.get(`${environment.apiUrl}/api/Order/GetAllOrder`);
  }

  getOrderById(id: number): Observable<any>{
    return this._httpClient.get(`${environment.apiUrl}/api/Order/GetOrder/${id}`);
  }

  getAllOrderDetailByOrderId(idOrder: number): Observable<any>{
    return this._httpClient.get(`${environment.apiUrl}/api/OrderDetail/GetAllOrderDetailByIdOrder/${idOrder}`);
  }

  getAllStatusOrders(): Observable<any>{
    return this._httpClient.get(`${environment.apiUrl}/api/StatusOrder/GetAllStatusOrders`);
  }

  changeStatusOrder(id: number, statusId: number): Observable<any>{
    return this._httpClient.put<any>(`${environment.apiUrl}/api/Order/ChangeStatusOrder/${id}`, {statusId});
  }
}
