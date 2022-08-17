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
  @Input() orderDetails;

  constructor(private _userOrderManagementItemService : UserOrderManagementItemService,private _userOrderManagementService : UserOrderManagementService) { }

  ngOnInit(): void {
    this.orderDetails.forEach(itemOrderDetail => {
      this.totalPriceOrder+=(itemOrderDetail.price*itemOrderDetail.quantity);
    });
  }
}
