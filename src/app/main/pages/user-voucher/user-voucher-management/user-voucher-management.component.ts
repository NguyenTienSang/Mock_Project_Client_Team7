import { Component, OnInit } from '@angular/core';

import { UserVoucherManagementService } from './user-voucher-management.service';

@Component({
  selector: 'app-user-voucher-management',
  templateUrl: './user-voucher-management.component.html',
  styleUrls: ['./user-voucher-management.component.scss']
})
export class UserVoucherManagementComponent implements OnInit {

  // Public
  public contentHeader: object;
  public listVoucherUsers;
  private userID = JSON.parse(localStorage.getItem('currentUser')).user.id;


  constructor(private _userVoucherManagementService : UserVoucherManagementService) { }

  ngOnInit(): void {
    this._userVoucherManagementService.getVoucherUser(this.userID).subscribe(respone=>{
      this.listVoucherUsers = respone.resultObj;
      console.log('respone.resultObj : ',respone.resultObj);

      // this.listOrderUsersTemp = this.listOrderUsers;
    })

  // content header
  this.contentHeader = {
    headerTitle: 'Voucher',
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
          name: 'My Voucher',
          isLink: false
        }
      ]
    }
  };


  }

}
