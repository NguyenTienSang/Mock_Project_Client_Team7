import { Component, OnInit } from '@angular/core';

import { UserVoucherManagementService } from './user-voucher-management.service';

@Component({
  selector: 'app-user-voucher-management',
  templateUrl: './user-voucher-management.component.html',
  styleUrls: ['./user-voucher-management.component.scss']
})
export class UserVoucherManagementComponent implements OnInit {

  // Public
  public todayDate = new Date();
  public contentHeader: object;
  public listVoucherUsers;
  private userID = JSON.parse(localStorage.getItem('currentUser')).user.id;



  constructor(private _userVoucherManagementService : UserVoucherManagementService) { }

  // CompareDate(dateCompare : Date,name : string){
  //   // date1.now
  //   // console.log('dateCompare : ',dateCompare);
  //   // console.log('name : ',name);



  //   // if(todayDate > dateCompare)
  //   // {
  //   //   console.log('big more');

  //   //   return false;
  //   // }
  //   // return true;

  //  return this._userVoucherManagementService.CompareDate(dateCompare,name);
  // }

  CompareDate(dateCompare : string){
    return  new Date(dateCompare).getTime() >=  new Date(this.todayDate.toISOString()).getTime();
  }




  ngOnInit(): void {
    this._userVoucherManagementService.getVoucherUser(this.userID).subscribe(respone=>{
      this.listVoucherUsers = respone.resultObj;
      console.log('respone.resultObj : ',respone.resultObj);
      console.log(typeof(this.todayDate.toISOString()));


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
