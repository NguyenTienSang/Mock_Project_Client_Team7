import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  constructor(private _httpClient: HttpClient) { }

  getVouchers():Observable<any>{
    return this._httpClient.get<any>(`${environment.apiUrl}/api/Voucher/all`);
  }

  addVoucher(voucherForCreate: any):Observable<any>{
    return this._httpClient.post(`${environment.apiUrl}/api/Voucher/create`, voucherForCreate);
  }

  updateVoucher(id:number, voucherForUpdate:any):Observable<any>{
    return this._httpClient.put(`${environment.apiUrl}/api/Voucher/update/${id}`, voucherForUpdate);
  }

  deleteVoucher(id:number):Observable<any>{
    return this._httpClient.delete(`${environment.apiUrl}/api/Voucher/delete/${id}`);
  }

  getListUser():Observable<any>{
    return this._httpClient.get(`${environment.apiUrl}/api/User/all`);
  }

  addVoucherUser(vmAddVoucherUser):Observable<any>{
    console.log('vmAddVoucherUser : ',vmAddVoucherUser);

    return this._httpClient.post(`${environment.apiUrl}/api/VoucherUser/CreateVoucherUser`, vmAddVoucherUser);
  }


}
