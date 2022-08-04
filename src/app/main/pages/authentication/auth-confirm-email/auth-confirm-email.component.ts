import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CoreConfigService } from '@core/services/config.service';
import { Router } from '@angular/router';
import { AuthConfirmEmailService } from './auth-confirm-email.service';
@Component({
  selector: 'app-auth-confirm-email',
  templateUrl: './auth-confirm-email.component.html',
  styleUrls: ['./auth-confirm-email.component.scss']
})
export class AuthConfirmEmailComponent implements OnInit {

 // Public
 public newPasswordVar;
 public confPasswordVar;
 public coreConfig: any;
 public passwordTextType: boolean;
 public confPasswordTextType: boolean;


public messageConfirmEmail;

 public lastValue;
 public url = this.router.url;
 // Private
 private _unsubscribeAll: Subject<any>;

 /**
  * Constructor
  *
  * @param {CoreConfigService} _coreConfigService
  */
 constructor(private router: Router,private _confirmEmailService: AuthConfirmEmailService, private _coreConfigService: CoreConfigService) {
   this._unsubscribeAll = new Subject();
   this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
  //  const test = this.url.substr(this.url.lastIndexOf('/'),)
  //  console.log('this.lastValue : ',this.lastValue);
   var listUrl = this.url.split('/');
   console.log('id : ',listUrl[4]);
   console.log('token : ',listUrl[5]);

   const test = this.url.substr(this.url.lastIndexOf(listUrl[4]) + 2);
  // this._confirmEmailService.confirmEmail(listUrl[4],this.url.substr(this.url.lastIndexOf(listUrl[4]) + 2)).subscribe((response) => {
    this._confirmEmailService.confirmEmail(listUrl[4]).subscribe((response) => {
      this.messageConfirmEmail = response.message;
    console.log(response);
    // console.log(response.message);

  })



   // Configure the layout
   this._coreConfigService.config = {
     layout: {
       navbar: {
         hidden: true
       },
       menu: {
         hidden: true
       },
       footer: {
         hidden: true
       },
       customizer: false,
       enableLocalStorage: false
     }
   };
 }

 /**
  * Toggle password
  */
 togglePasswordTextType() {
   this.passwordTextType = !this.passwordTextType;
 }

 /**
  * Toggle confirm password
  */
 toggleConfPasswordTextType() {
   this.confPasswordTextType = !this.confPasswordTextType;
 }

 // Lifecycle Hooks
 // -----------------------------------------------------------------------------------------------------

 /**
  * On init
  */
 ngOnInit(): void {
   // Subscribe to config changes
   this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
     this.coreConfig = config;
   });
 }

 /**
  * On destroy
  */
 ngOnDestroy(): void {
   // Unsubscribe from all subscriptions
   this._unsubscribeAll.next();
   this._unsubscribeAll.complete();
 }

}
