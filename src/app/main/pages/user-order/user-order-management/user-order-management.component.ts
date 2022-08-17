import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import Stepper from 'bs-stepper';
import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import { AccountSettingsService } from 'app/main/pages/account-settings/account-settings.service';
import {UserOrderManagementService} from 'app/main/pages/user-order/user-order-management/user-order-management.service';
import { UserOrderManagementItemComponent } from '../user-order-management-item/user-order-management-item.component';

@Component({
  selector: 'app-user-order-management',
  templateUrl: './user-order-management.component.html',
  styleUrls: ['./user-order-management.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' }
})
export class UserOrderManagementComponent implements OnInit {

  // Public
  public contentHeader: object;

  private userID = JSON.parse(localStorage.getItem('currentUser')).user.id;
  public listOrderUsers;
  public listOrderUsersTemp;
  // public totalPrice = 0;
  public disableOrder = false;
  public search = '';




  constructor(private _userOrderManagementService: UserOrderManagementService,private _ecommerceService: EcommerceService) {

  }



  SearchMyOrder(){
    if(this.search != null || this.search != " "){
      let search = this.search.toLowerCase();
      // x.orderDetails.product.name.toString().toLowerCase().includes(search)
      this.listOrderUsers = this.listOrderUsersTemp.filter(x=>x.id.toString().toLowerCase().includes(search)
      || x.statusOrder.name.toString().toLowerCase().includes(search)
      || x.orderDetails.some(orderDetail => orderDetail.product.name.toString().toLowerCase().includes(search)))
    }
    else{
      this.listOrderUsers = this.listOrderUsersTemp;
    }
  }



  ngOnInit(): void {
      this._userOrderManagementService.SearchMyOrder().subscribe(respone=>{
      this.listOrderUsers = respone.resultObj;
      this.listOrderUsersTemp = this.listOrderUsers;
    })

    // content header
    this.contentHeader = {
      headerTitle: 'Order',
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
            name: 'My Order',
            isLink: false
          }
        ]
      }
    };
  }

}
