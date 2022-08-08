import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthenticationService } from 'app/auth/service';
import { CoreConfigService } from '@core/services/config.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-auth-register-v2',
  templateUrl: './auth-register-v2.component.html',
  styleUrls: ['./auth-register-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthRegisterV2Component implements OnInit {
  // Public
  public userNameVar;
  public registerForm: FormGroup;
  public emailVar;
  public passwordVar;
  public confirmpasswordVar;
  public addressVar;
  public phoneNumberVar;
  public returnUrl: string;
  public error = '';
  public message = '';
  public typealert = '';
  public coreConfig: any;
  public passwordTextType: boolean;
  public submitted = false;
  public loading = false;

  public phoneNumberPtn = '(03|05|07|08|09)+([0-9]{8})'


  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authenticationService: AuthenticationService,
    private _http: HttpClient,
    ) {


  // redirect to home if already logged in
  if (this._authenticationService.currentUserValue) {
    this._router.navigate(['/']);
  }
  this._unsubscribeAll = new Subject();

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

// convenience getter for easy access to form fields
get f() {
  return this.registerForm.controls;
}


  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    console.log(this.phoneNumberVar);
    
    this.submitted = true;

    // stop here if form is invalid
    // if (this.registerForm.invalid) {
    //   return;
    // }

    // console.log('this.userNameVar : ',this.userNameVar);
    // console.log('this.emailVar : ',this.emailVar);
    // console.log('this.passwordVar : ',this.passwordVar);
    // console.log('this.addressVar : ',this.addressVar);
    // console.log('this.phoneNumberVar : ',this.phoneNumberVar);
    if(!this.userNameVar || !this.emailVar || !this.passwordVar || !this.confirmpasswordVar || !this.addressVar || !this.phoneNumberVar)
    {
      this.typealert = "danger";
      this.message = "Please enter full field";
    }
    else {
      if(this.passwordVar != this.confirmpasswordVar)
      {
        this.typealert = "danger";
        this.message = "Confirm password not exactly";
      }
      else {
      this.loading = true;
      this._authenticationService
        .register(this.userNameVar,this.emailVar,this.passwordVar,this.addressVar,this.phoneNumberVar)
        .subscribe(
          data => {
            if(data.isSuccessed == true)
            {
              this.typealert = "success";
            }
            else {
              this.typealert = "danger";
            }
            console.log(data.message);
            this.message = data.message;
          },
          error => {
            this.error = error;
            this.loading = false;
          }
        );
      }
    }

  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // this.registerForm = this._formBuilder.group({
    //   // email: ['admin@demo.com', [Validators.required, Validators.email]],
    //   // password: ['admin', Validators.required]
    //   username: [''],
    //   email: [''],
    //   password: ['']
    // });

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';



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
