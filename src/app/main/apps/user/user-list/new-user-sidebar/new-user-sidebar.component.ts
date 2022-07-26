import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { UserListService } from 'app/main/apps/user/user-list/user-list.service';
//import Swal  from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-user-sidebar',
  templateUrl: './new-user-sidebar.component.html'
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

  onChange(selectedrole) {
    this.role = selectedrole.target.value;
    // I want to do something here with the new selectedDevice, but what I
    // get here is always the last selection, not the one I just selected.
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
  
      this._userListService.createUser(currentUser).subscribe(respone =>{
        console.log("respone",respone);
        if(respone.isSuccessed)
        {
          setTimeout(() => {
            this._toastrService.success(
              ' '+respone.message+' ',
              'Create user',
              { toastClass: 'toast ngx-toastr', closeButton: true }
            );
          }, 2000);
        }
        else{
          setTimeout(() => {
            this._toastrService.error(
              ''+respone.message+'',
              'Create user',
              { toastClass: 'toast ngx-toastr', closeButton: true }
            );
          }, 2500);
        }
      });
  }
}
  ngOnInit(): void {}

//   showSuccessMessage(
//     title, message, icon = null,
//     showCancelButton = true){
//     return Swal.fire({
//       title: title,
//       text: message,
//       icon: icon,
//       showCancelButton: showCancelButton
//     })
//  }
}
