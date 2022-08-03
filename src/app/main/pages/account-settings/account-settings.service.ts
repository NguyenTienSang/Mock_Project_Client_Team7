import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable()
export class AccountSettingsService implements Resolve<any> {
  rows: any;
  onDatatablessChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onDatatablessChanged = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getDataTableRows()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get rows
   */
  getDataTableRows(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/account-settings-data').subscribe((response: any) => {
        this.rows = response;
        this.onDatatablessChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }

  uploadImageToCloud(formData: FormData, id : string) {
    return this._httpClient.post<any>(`${environment.apiUrl}/api/User/upload-avatar/${id}`,formData).pipe(map(
     response => {
      console.log('response : ',response);

       return response
     }
    ));
   }

   updateProfile(firstName : string, lastName : string, phoneNumber : string, email : string, role : string, status :string, id : string){
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

   getUserContact(id: string): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiUrl}/api/User/getallcontact/${id}`)
  };

  getUserDetailContact(id: string): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiUrl}/api/User/getdetailcontact/${id}`)
  };


  addContact(name : string, address : string, phonenumber : string){
    return this._httpClient.post<any>(`${environment.apiUrl}/api/User/contact/add`,{
      name,
      address,
      phonenumber
    }).pipe(map(
      response => {
      return response;
    }))
  }

  editContact(id : string,name : string, address : string, phonenumber : string){
    return this._httpClient.put<any>(`${environment.apiUrl}/api/User/contact/update/${id}`,{
      name,
      address,
      phonenumber
    }).pipe(map(
      response => {
      return response;
    }))
  }

  deleteContact(id : string){
    return this._httpClient.delete<any>(`${environment.apiUrl}/api/User/contact/delete/${id}`).pipe(map(
      response => {
      return response;
    }))
  }


}
