import { filter } from 'rxjs/operators';
// import { environment } from './../../../../environments/environment.hmr';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserVoucherManagementService {

  constructor(private _httpClient: HttpClient) {

  }

  getVoucherUser(idUser: string): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiUrl}/api/VoucherUser/GetVoucherUser/${idUser}`)
  };

  CompareDate(dateCompare : Date,name : string)
  {
    console.log('dateCompare : ',dateCompare);
    console.log('name : ',name);

    var todayDate = new Date();

    if(todayDate > dateCompare)
    {
      console.log('big more');

      return false;
    }
    return true;
  }


}
