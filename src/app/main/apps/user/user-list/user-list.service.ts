import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class UserListService implements Resolve<any> {
  public rows: any;
  public onDatatablessChanged: BehaviorSubject<any>;
  public user: any;
  public onUser: BehaviorSubject<any>;

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
      // this._httpClient.get(`${environment.apiUrl}/api/User/all`).subscribe((response: any) => {
        // this._httpClient.get(`${environment.apiUrl}/api/User/all`).subscribe((response: any) => {
         const currentUser = JSON.parse(localStorage.getItem("currentUser"));
          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${auth_token}`
            'Authorization': `Bearer ` + currentUser.resultObj
          })
          this._httpClient.get(`${environment.apiUrl}/api/User/all`, { headers: headers }).subscribe((response: any) => {
        this.rows = response.resultObj;
        console.log("response  :",response);
        this.onDatatablessChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }

  // createUser(user: any) : Observable<any> {
  //   return this._httpClient.post<any>(`${environment.apiUrl}/api/User/create/`, user)
  // }

  createUser(user: any): Observable<any> {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${auth_token}`
            'Authorization': `Bearer ` + currentUser.resultObj
          });
    return this._httpClient.post<any>(`${environment.apiUrl}/api/User/create`, user, { headers: headers })
  };

  //Upload image to cloudinary

  onUploadAvatar(username: string, formData: FormData):Observable<any>{

    return this._httpClient.post(`${environment.apiUrl}/api/User/upload-avatar/${username}`,formData)
  }

  deleteProduct(id: string):Observable<any>{
    return this._httpClient.delete(`${environment.apiUrl}/api/User/delete/${id}`);
  }
}
