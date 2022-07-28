import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { UserListService } from 'app/main/apps/user/user-list/user-list.service';
import Swal  from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-user-sidebar',
  templateUrl: './new-user-sidebar.component.html',
  // styleUrls: ['./new-user-sidebar.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class NewUserSidebarComponent implements OnInit {
  public firstname;
  public lastname;
  //public phonenumber;
  //public address;
  public username;
  public password;
  public confirmpass;
  public email;
  public role;
  public avatar;
  public passwordTextType: boolean;
  public confirmPasswordTextType: boolean;

  usernamePtn = '^(?=[a-zA-Z0-9._]{6,12}$)(?!.*[_.]{2})[^_.].*[^_.]$';
  passwordPtn = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,16}$';
  emailPtn = '^[\\w!#$%&’*+/=?`{|}~^-]+(?:\\.[\\w!#$%&’*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$';

  roles = ["Master", "Mod", "User"];

 

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService, 
    private _userListService: UserListService,
    private _toastrService: ToastrService) {}

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }
  toggleConfirmPasswordTextType() {
    this.confirmPasswordTextType = !this.confirmPasswordTextType;
  }

  onChange(selectedrole) {
    this.role = selectedrole.target.value;
  }

  fileToUpload: any;
//Show image when select
  upload(e : any){
    this.fileToUpload = e.target.files[0]
  }
  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    if (form.valid) {
      this.toggleSidebar('new-user-sidebar');
    }
    if(this.password == this.confirmpass){
      var currentUser = {
        "FirstName": this.firstname,
        "LastName": this.lastname,
        // "PhoneNumber": this.phonenumber,
        "Password": this.password,
        "UserName": this.username,
        "Avatar": "https://icon-library.com/images/anonymous-person-icon/anonymous-person-icon-18.jpg",
        "Email": this.email,
        "Role": this.role
      };
      console.log("avatar",this.avatar);
      this._userListService.createUser(currentUser).subscribe(respone =>{
        console.log("respone",respone);
        if(respone.isSuccessed)
        {
          console.log(1);
          Swal.fire("Success",respone.message,"success")
          //setTimeout(() => {
            // this._toastrService.success(
            //   ' '+respone.message+' ',
            //   'Create user',
            //   { toastClass: 'toast ngx-toastr', closeButton: true }
            // );
         // }, 2000);
          let formData = new FormData();
          formData.append('formFile',this.fileToUpload);
          this._userListService.onUploadAvatar(this.username, formData).subscribe();
          
        }
        else{
          Swal.fire("Error",respone.message,"error")
        }
      });
  }
}
  ngOnInit(): void {
    this.role = this.roles[0];
  }
}
