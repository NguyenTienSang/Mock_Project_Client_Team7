import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserOrderManagementItemService {

  public totalPriceOrder = 0;

  constructor(private _httpClient: HttpClient) { }

  getOrderDetailUser(orderId : string): Observable<any>{
    return this._httpClient.get<any>(`${environment.apiUrl}/api/OrderDetail/GetAllOrderDetailByIdOrder/${orderId}`).pipe(map(response => {
        this.totalPriceOrder = 0;
        // console.log('response.resultObj : ',response.resultObj);
        response.resultObj.forEach(itemOrderDetail => {
          // console.log('element : ');
          this.totalPriceOrder+=itemOrderDetail.price;
        });
        // console.log('this.totalPriceOrder : ',this.totalPriceOrder);
        // response = {...response,totalPriceOrder : this.totalPriceOrder}
        return {...response,totalPriceOrder : this.totalPriceOrder};
    }))
  }

  getVoucherById(id: string):Observable<any>{
    return this._httpClient.get(`${environment.apiUrl}/api/Voucher/${id}`)
  }
}
