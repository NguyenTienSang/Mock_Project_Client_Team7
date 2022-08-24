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
export class ListVoucherUserManagementService {

  constructor(private _httpClient: HttpClient) {

  }

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

}
