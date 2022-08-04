import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserViewService  {
  public rows: any;
  public onDataChanged: BehaviorSubject<any>;
  public id;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    // this.onDataChanged = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
  //   let currentId = Number(route.paramMap.get('id'));
  //   return new Promise<void>((resolve, reject) => {
  //     Promise.all([this.getApiData(currentId)]).then(() => {
  //       resolve();
  //     }, reject);
  //   });
  // }

  /**
   * Get rows
   */
  // getApiData(id: number): Promise<any[]> {
  //   const url = `api/users-data/${id}`;

  //   return new Promise((resolve, reject) => {
  //     this._httpClient.get(url).subscribe((response: any) => {
  //       this.rows = response;
  //       this.onDataChanged.next(this.rows);
  //       resolve(this.rows);
  //     }, reject);
  //   });
  // }

  getUser(id: string): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiUrl}/api/User/${id}`)
  };

  getUserContact(id: string): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiUrl}/api/User/getallcontact/${id}`)
  };
}
