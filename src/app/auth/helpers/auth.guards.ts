import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from 'app/auth/service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  /**
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(private _router: Router, private _authenticationService: AuthenticationService) {}

  // canActivate
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this._authenticationService.currentUserValue;
    // const test = currentUser;
    if (currentUser) {
      // check if route is restricted by role
      console.log('Test nhaaaaaaaa : ',currentUser["Role"]);


      // if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {

      //   if (currentUser["Role"] == "User" ) {
      //   // role not authorised so redirect to not-authorized page
      //   this._router.navigate(['/pages/miscellaneous/not-authorized']);
      //   return false;
      // }
      console.log('Test nhaaaaaaaa2222 : ',currentUser["Role"]);

      // this._router.navigate(['/apps/user/user-list'])
      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this._router.navigate(['/pages/authentication/login-v2'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
