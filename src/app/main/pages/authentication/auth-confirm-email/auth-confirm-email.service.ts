import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthConfirmEmailService {

  constructor(private _httpClient: HttpClient) { }

  confirmEmail(id : string){
    return this._httpClient.get<any>(`${environment.apiUrl}/api/Authenticate/confirm-email/${id}`).pipe(map(
      response => {
      return response;
    }))
  }
}
