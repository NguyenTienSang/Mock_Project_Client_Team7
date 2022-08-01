import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup,FormControl,FormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { AccountSettingsService } from 'app/main/pages/account-settings/account-settings.service';
@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountSettingsComponent implements OnInit {
  // public
  public contentHeader: object;
  public data: any;
  public birthDateOptions: FlatpickrOptions = {
    altInput: true
  };
  public passwordTextTypeOld = false;
  public passwordTextTypeNew = false;
  public passwordTextTypeRetype = false;

  public message = '';
  public typealert = '';

  public messageUploadSettings = '';
  public typeAlertUploadSettings = '';

  public contacts: any;

  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {AccountSettingsService} _accountSettingsService
   */
  constructor(private _accountSettingsService: AccountSettingsService) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Password Text Type Old
   */
  togglePasswordTextTypeOld() {
    this.passwordTextTypeOld = !this.passwordTextTypeOld;
  }

  /**
   * Toggle Password Text Type New
   */
  togglePasswordTextTypeNew() {
    this.passwordTextTypeNew = !this.passwordTextTypeNew;
  }

  /**
   * Toggle Password Text Type Retype
   */
  togglePasswordTextTypeRetype() {
    this.passwordTextTypeRetype = !this.passwordTextTypeRetype;
  }


  updateProfile(){
    this._accountSettingsService.updateProfile(
      this.updateProfileForm.value.firstname,
      this.updateProfileForm.value.lastname,
      this.updateProfileForm.value.phonenumber,
      this.updateProfileForm.value.email,
      this.data.user.role,
      this.data.user.status,
      this.data.user.id,
    ).subscribe((response)=>{
      console.log("response nts 1 : ",response.message);
      // this.router.navigate([this.router.url])

      if(response.isSuccessed == true)
      {
        this.typealert = "success";
        this.data.user.firstName = this.updateProfileForm.value.firstname;
        this.data.user.lastName = this.updateProfileForm.value.lastname;
        this.data.user.phoneNumber = this.updateProfileForm.value.phonenumber;
        this.data.user.email = this.updateProfileForm.value.email;
        localStorage.setItem("currentUser",JSON.stringify(this.data));
      }
      else {
        this.typealert = "danger";
      }
      this.message = response.message;
    },(err) =>{
      console.log(err);
    })


  }






  fileToUpload: any;
//Show image when select
  onSelectFileAvatar(e : any){
    this.fileToUpload = e.target.files[0]
      if(e){
        var reader=new FileReader();
        reader.readAsDataURL(e.target.files[0]);

        reader.onload=(event:any)=>{
          this.data.user.avatar=event.target.result;
      }
      }
  }

  updateProfileForm = new FormGroup({
    lastname : new FormControl('', [Validators.required]),
    firstname : new FormControl('', Validators.required),
    username : new FormControl('', Validators.required),
    phonenumber : new FormControl('', Validators.required),
    email : new FormControl('', Validators.required),
  })



  //Upload image to cloudinary
  onUploadAvatar(){
    console.log('this.fileToUpload : ',this.fileToUpload);
    if(!this.fileToUpload)
    {
      this.typeAlertUploadSettings = "danger";
      this.messageUploadSettings = "Please choose file !!!";
    }
    else {
      let formData = new FormData();
      console.log('Form data : ',formData);
      formData.append('formFile',this.fileToUpload);
      this._accountSettingsService.uploadImageToCloud(formData,this.data.user.id).subscribe((response)=>{
        if(response.isSuccessed == true)
        {
          this.typeAlertUploadSettings = "success";

          // if(this.updateUserCurrent.user.id == this.urlLastValue)
          // {
            this.data.user.avatar = response.resultObj.avatar;
            localStorage.setItem("currentUser",JSON.stringify(this.data));
            // localStorage.setItem("currentUser",JSON.stringify(

            //     // this.updateProfileForm.value.firstname,
            //     // this.updateProfileForm.value.lastname,
            //     // this.updateProfileForm.value.phonenumber,
            //     // this.updateProfileForm.value.email,
            //     // this.data.role,
            //     // this.data.status,
            //     this.data.id

            // ));
          // }

          setTimeout( () => {    window.location.reload();}, 1000 );
        }
        else {
          this.typeAlertUploadSettings = "danger";
        }
        this.messageUploadSettings = response.message;
    },(err) =>{
      console.log(err);
    });
    }

  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() : void {
    // this._accountSettingsService.onDatatablessChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
    //   this.data = response;
    // });


    this.data = (JSON.parse(localStorage.getItem("currentUser")));

    this._accountSettingsService.getUserContact(this.data.user.id).subscribe(respone=>{
      this.contacts = respone.resultObj;
    })



    // content header
    this.contentHeader = {
      headerTitle: 'Profile',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Pages',
            isLink: true,
            link: '/'
          },
          {
            name: 'Profile',
            isLink: false
          }
        ]
      }
    };
  }


  get lastName() {
    return this.updateProfileForm.get('lastname');
  }

  get firstName() {
    return this.updateProfileForm.get('firstname');
  }

  get email() {
    return this.updateProfileForm.get('email');
  }

  get phoneNumber() {
    return this.updateProfileForm.get('phonenumber');
  }

}
