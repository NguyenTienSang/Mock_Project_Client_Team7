import { Component, OnInit, Input } from '@angular/core';
import {UserOrderManagementItemService} from '../user-order-management-item/user-order-management-item.service'

@Component({
  selector: 'app-user-order-management-item',
  templateUrl: './user-order-management-item.component.html',
  styleUrls: ['./user-order-management-item.component.scss']
})
export class UserOrderManagementItemComponent implements OnInit {
  public listOrderDetails;
  @Input() order;

  constructor(private _userOrderManagementItemService : UserOrderManagementItemService) { }

  ngOnInit(): void {
    console.log('this.order : ',this.order);

      this._userOrderManagementItemService.getOrderDetailUser(this.order).subscribe(respone=>{
        this.listOrderDetails = respone.resultObj;
        console.log('this.listOrderDetails : ',this.listOrderDetails);

      });
  }
}
