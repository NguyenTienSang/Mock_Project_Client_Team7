import { Component, OnInit } from '@angular/core';
import { UserVoucherManagementService } from '../user-voucher-management/user-voucher-management.service';
import { ListVoucherUserManagementService } from './list-voucher-user-management.service';
import Swal  from 'sweetalert2';
@Component({
  selector: 'app-list-voucher-user-management',
  templateUrl: './list-voucher-user-management.component.html',
  styleUrls: ['./list-voucher-user-management.component.scss']
})

export class ListVoucherUserManagementComponent implements OnInit {

  // Public
  public todayDate = new Date();
  public contentHeader: object;
  public listVoucherUsers;
  // private userID = JSON.parse(localStorage.getItem('currentUser')).user.id;

  private idUserDetailVoucher = localStorage.getItem('idUserDetailVoucher');

  constructor(private _userVoucherManagementService : UserVoucherManagementService, private _listVoucherUserManagementService : ListVoucherUserManagementService) { }


  CompareDate(dateCompare : string){
    return  new Date(dateCompare).getTime() >=  new Date(this.todayDate.toISOString()).getTime();
  }


  deleteVoucher(userId : string, voucherId : string) {
    let vmDeleteVoucherUser= {
      voucherId: voucherId,
      userId: userId
    }

    // console.log('vmDeleteVoucherUser : ',vmDeleteVoucherUser);


    this._listVoucherUserManagementService.deleteVoucherUser(vmDeleteVoucherUser).subscribe(response=>{
      if(response.isSuccessed)
      {
        Swal.fire("Success",response.message,"success")
        this.getVoucher(this.idUserDetailVoucher);
        // this.modalService.dismissAll();
        // this.GetAllVoucher();
      }
      else
        Swal.fire("Error",response.message,"error")
    });

  }

  getVoucher(userId : string) {
    this._userVoucherManagementService.getVoucherUser(userId).subscribe(respone=>{
      this.listVoucherUsers = respone.resultObj;
      console.log('respone.resultObj : ',respone.resultObj);
      console.log(typeof(this.todayDate.toISOString()));
    })
  }



  ngOnInit(): void {

    this.getVoucher(this.idUserDetailVoucher);

    // this._userVoucherManagementService.getVoucherUser(this.idUserDetailVoucher).subscribe(respone=>{
    //   this.listVoucherUsers = respone.resultObj;
    //   console.log('respone.resultObj : ',respone.resultObj);
    //   console.log(typeof(this.todayDate.toISOString()));
    //   // const idUserDetailVoucher = localStorage.getItem('idUserDetailVoucher');

    //   // console.log('idUserDetailVoucher : ',idUserDetailVoucher);



    //   // console.log('this.idUserDetailVoucher : ',this.idUserDetailVoucher);

    //   // this.listOrderUsersTemp = this.listOrderUsers;
    // })



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
          name:'List Voucher Of User',
          isLink: false
        }
      ]
    }
  };


  }

}