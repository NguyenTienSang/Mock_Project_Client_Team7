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
  @Input() orderVoucherId;
  public voucherDiscount;

  constructor(private _userOrderManagementItemService : UserOrderManagementItemService,private _userOrderManagementService : UserOrderManagementService) { }

  ngOnInit(): void {
    this.orderDetails.forEach(itemOrderDetail => {
      // this.totalPriceOrder+=Number((itemOrderDetail.price*itemOrderDetail.quantity).toFixed(2));
      this.totalPriceOrder+=Number((itemOrderDetail.price * (1 - itemOrderDetail.discount*0.01)).toFixed(2)) * itemOrderDetail.quantity;
      this.totalPriceOrder = Number(this.totalPriceOrder.toFixed(2));




      // this._ecommerceService.totalPriceCart += Number((product.price - (product.price * product.discount*0.01)).toFixed(2));
      // this._ecommerceService.totalPriceCart = Number(this._ecommerceService.totalPriceCart.toFixed(2));



      // Number((orderDetailItem.price - (orderDetailItem.price * orderDetailItem.discount*0.01)).toFixed(2)) *  orderDetailItem.quantity
    });

    if(this.orderVoucherId != null){
      this._userOrderManagementItemService.getVoucherById(this.orderVoucherId).subscribe((res=>{
        this.voucherDiscount = res.resultObj;
        console.log("voucher discount", this.voucherDiscount);
        
      }))
    }
  }
}
