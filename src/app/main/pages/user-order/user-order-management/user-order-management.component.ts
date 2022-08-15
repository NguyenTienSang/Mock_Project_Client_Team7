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
  // public totalPrice = 0;
  public disableOrder = false;

  public listOrder;






  constructor(private _userOrderManagementService: UserOrderManagementService,private _ecommerceService: EcommerceService) {

  }



  ngOnInit(): void {

    this._userOrderManagementService.getOrderUser(this.userID).subscribe(respone=>{
      this.listOrderUsers = respone.resultObj;
      console.log('respone : ',respone);
      if(respone.isSuccessed)
      {
        // console.log('this._userOrderManagementItemComponent.totalPriceOrder : ',this._userOrderManagementItemComponent.totalPriceOrder);

        // this.totalPrice+=this._userOrderManagementItemComponent.totalPriceOrder;
        // console.log('this.totalPrice : ',this.totalPrice);
      }



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
