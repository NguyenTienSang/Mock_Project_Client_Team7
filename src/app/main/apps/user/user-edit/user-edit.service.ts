import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { User } from 'app/auth/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserEditService {
  public apiData: any;
  public resultObj: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    // this.onDataChanged = new BehaviorSubject({});
  }



   getCurrentUser(id : string): Observable<any> {

         return this._httpClient.get<any>(`${environment.apiUrl}/api/User/${id}`)

   }

   editUser(firstName : string, lastName : string, phoneNumber : string, email : string, role : string, status :string, id : string){
    return this._httpClient.put<any>(`${environment.apiUrl}/api/User/update/${id}`,
    {
      firstName,
      lastName,
      phoneNumber,
      email,
      role,
      status
    }).pipe(map(
      response => {
      return response;
    }))
   }


   uploadImageToCloud(formData: FormData, id : string) {
   return this._httpClient.post<any>(`${environment.apiUrl}/api/User/upload-avatar/${id}`,formData).pipe(map(
    response => {
      console.log('response : ',response);
      return response
    }
   ));
  }


  //

}
