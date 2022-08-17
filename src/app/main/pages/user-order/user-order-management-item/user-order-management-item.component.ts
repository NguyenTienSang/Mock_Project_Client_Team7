import { Component, OnInit, Input } from '@angular/core';
import {UserOrderManagementItemService} from '../user-order-management-item/user-order-management-item.service'

import { UserOrderManagementService } from '../user-order-management/user-order-management.service';
@Component({
  selector: 'app-user-order-management-item',
  templateUrl: './user-order-management-item.component.html',
  styleUrls: ['./user-order-management-item.component.scss']
})
export class UserOrderManagementItemComponent implements OnInit {
  public listOrderDetails;
  public totalPriceOrder = 0;
  @Input() order;

  constructor(private _userOrderManagementItemService : UserOrderManagementItemService,private _userOrderManagementService : UserOrderManagementService) { }

  ngOnInit(): void {
    console.log('this.order : ',this.order);
      this._userOrderManagementItemService.getOrderDetailUser(this.order).subscribe(respone=>{
        this.listOrderDetails = respone.resultObj;
        console.log('respone.totalPriceOrder : ',respone.totalPriceOrder);
        this.totalPriceOrder = respone.totalPriceOrder
        // console.log('this.listOrderDetails : ',this.listOrderDetails);
        // this.totalPriceOrder = 0

      });
  }
}
