import { filter } from 'rxjs/operators';
// import { environment } from './../../../../environments/environment.hmr';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import {Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserVoucherManagementService {

  constructor(private _httpClient: HttpClient) {

  }

  getVoucherUser(idUser: string): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiUrl}/api/VoucherUser/GetVoucherUser/${idUser}`)
  };

  // deleteVoucherUser(vmDeleteVoucherUser : any): Observable<any> {
    deleteVoucherUser(vmDeleteVoucherUser : any): Observable<any> {
    // console.log('vmDeleteVoucherUser 1 : ',vmDeleteVoucherUser);
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
          let options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
            body: vmDeleteVoucherUser,
          };

    return this._httpClient.delete<any>(`${environment.apiUrl}/api/VoucherUser/DeleteVoucherUser`,
    options
    ).pipe(map(
      response => {
      return response;
    }))
  }


  addVoucherUser(vmAddVoucherUser):Observable<any>{
    console.log('vmAddVoucherUser : ',vmAddVoucherUser);

    return this._httpClient.post(`${environment.apiUrl}/api/VoucherUser/CreateVoucherUser`, vmAddVoucherUser);
  }



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
