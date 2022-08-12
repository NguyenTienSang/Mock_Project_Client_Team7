import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderManagementService {

  constructor(private _httpClient: HttpClient) { }

  getOrders(): Observable<any>{
    return this._httpClient.get(`${environment.apiUrl}/api/Order/GetAllOrder`);
  }
}
