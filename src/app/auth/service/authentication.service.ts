import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { User, Role } from 'app/auth/models';
import { ToastrService } from 'ngx-toastr';

//import { JwtHelperService } from "@auth0/angular-jwt";

//const helper = new JwtHelperService();
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  //public
  public currentUser: Observable<User>;

  //private
  private currentUserSubject: BehaviorSubject<User>;

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(private _http: HttpClient, private _toastrService: ToastrService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
    // console.log('this.currentUserSubject : ',this.currentUserSubject.value["Role"]);

    return this.currentUser && this.currentUserSubject.value.role === Role.Master;
  }

  /**
   *  Confirms if user is client
   */
  get isClient() {
    return this.currentUser && this.currentUserSubject.value.role === Role.User;
  }

  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */
  login(UserName: string, Password: string) {
    // login(email: string, password: string) {
      console.log('UserName : ',UserName);
      console.log('Password : ',Password);
    if(UserName && Password)
    {
      return this._http
      .post<any>(`${environment.apiUrl}/api/Authenticate/login`, {
      UserName ,
      Password
   })
  // .post<any>(`${environment.apiUrl}/users/authenticate`, {email : "admin@demo.com" , password : "admin" })
    .pipe(
      map(response => {
        // console.log('Test');
        console.log("user : ",response);
        //const decodedToken = helper.decodeToken(response.resultObj);
        //console.log("decodedToken : ",decodedToken);


        // login successful if there's a jwt token in the response
        if (response && response.resultObj) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(response));

          // Display welcome toast!
          setTimeout(() => {
            this._toastrService.success(
              'You have successfully logged in as an ' +
              response.user.role +
                ' user to Vuexy. Now you can start to explore. Enjoy! 🎉',
              '👋 Welcome, ' + response.user.firstName + '!',
              { toastClass: 'toast ngx-toastr', closeButton: true }
            );
          }, 2500);

          // notify
          //this.currentUserSubject.next(decodedToken);
        }

        return response;
      })
    );
    }

  }

/**
   * User register
   *
   * @param username
   * @param email
   * @param password
   * @returns user
   */

 register(UserName: string,Email: string, Password: string, Address : string, PhoneNumber : string) {
  console.log('UserName : ',UserName);
  console.log('Email : ',Email);
  console.log('Password : ',Password);
  console.log('Address : ',Address);
  console.log('PhoneNumber : ',PhoneNumber);

  return this._http
  .post<any>(`${environment.apiUrl}/api/Authenticate/register`, {
  UserName ,
  Email ,
  Password
}).pipe(map(
  response => {

    return response;
  }
)
)
 }

  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // notify
    this.currentUserSubject.next(null);
  }
}
