import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import { NavbarCartComponent } from 'app/layout/components/navbar/navbar-cart/navbar-cart.component';
import { Component, OnInit } from '@angular/core';
import { UserVoucherManagementService } from './user-voucher-management.service';
import Swal  from 'sweetalert2';

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
  public lengthCart;
  // private userID = JSON.parse(localStorage.getItem('currentUser')).user.id;

  private idUserDetailVoucher = JSON.parse(localStorage.getItem('currentUser')).user.id;

  constructor(private _userVoucherManagementService : UserVoucherManagementService,private _ecommerceService: EcommerceService,) { }

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


  deleteVoucher(userId : string, voucherId : string) {
    let vmDeleteVoucherUser= {
      voucherId: voucherId,
      userId: userId
    }

    // console.log('vmDeleteVoucherUser : ',vmDeleteVoucherUser);


    this._userVoucherManagementService.deleteVoucherUser(vmDeleteVoucherUser).subscribe(response=>{
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

    this._ecommerceService.onCartListChange.subscribe(res => {
      this.lengthCart = res.length;
    });

    this.getVoucher(this.idUserDetailVoucher);




    // console.log('this._navbarCartComponent.cartListLength : ',this._navbarCartComponent.cartListLength);


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
          name:  'My Voucher',
          isLink: false
        }
      ]
    }
  };


  }

}