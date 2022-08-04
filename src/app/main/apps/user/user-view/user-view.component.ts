import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserViewService } from 'app/main/apps/user/user-view/user-view.service';
import Swal from 'sweetalert2';
import { UserListService } from 'app/main/apps/user/user-list/user-list.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserViewComponent implements OnInit {
  // public
  public url = this.router.url;
  public lastValue;
  public data;

  // private
  private _unsubscribeAll: Subject<any>;

  public contacts: any
  /**
   * Constructor
   *
   * @param {Router} router
   * @param {UserViewService} _userViewService
   */
  constructor(private router: Router, private _userViewService: UserViewService, private _userListService: UserListService) {
    this._unsubscribeAll = new Subject();
    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this._userViewService.getUser(this.lastValue).subscribe(response => {
      this.data = response.resultObj;
    });
    this._userViewService.getUserContact(this.lastValue).subscribe(respone=>{
      this.contacts = respone.resultObj;
    })
  }

  deleteUser(id: string) {

    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._userListService.deleteProduct(id).subscribe((respone=>{
          console.log("delete user", respone);
          if(respone.isSuccessed)
          {
            Swal.fire("Success", respone.message, "success");
            window.location.reload();
            // this._userListService.onDatatablessChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
            //   this.rows = response;
            //   this.tempData = this.rows;
            // });
          }
          else
            Swal.fire("Error", respone.message, "error");
        }),
        (error=>{
          Swal.fire("Error", error, "error");
        })
        );
      } 
      // else if (result.dismiss === Swal.DismissReason.cancel) {
      //   Swal.fire(
      //     'Cancelled',
      //     'Your imaginary file is safe :)',
      //     'error'
      //   )
      // }
    })
  }
}
