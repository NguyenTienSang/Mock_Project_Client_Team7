import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class UserListService implements Resolve<any> {
  public rows: any;
  public onDatatablessChanged: BehaviorSubject<any>;

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
        this.rows = response;
        console.log("response  :",response);
        this.onDatatablessChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }
}
