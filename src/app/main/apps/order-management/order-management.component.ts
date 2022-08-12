import { Component, OnInit } from '@angular/core';
import { OrderManagementService } from './order-management.service';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss'],
   // content:attr(value);
  // styles: [`
  // .badge:after{
  //   content:attr(value);
  //   font-size:15px;
  //   color: #fff;
  //   background: red;
  //   border-radius:50%;
  //   padding: 0 5px;
  //   position:relative;
  //   left:-8px;
  //   top:-10px;
  //   opacity:0.9;
  // }
  // `]

  styles: [`
  .nts {
    position: absolute;
    left: 30px;
    bottom: 30px;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    border: 1px solid red;
    border-radius: 100%;
    background-color: red;
    width: 20px;
    height: 20px;
  }
  `]

})
export class OrderManagementComponent implements OnInit {


  public orders;
  contentHeader: { headerTitle: string; actionButton: boolean; breadcrumb: { type: string; links: ({ name: string; isLink: boolean; link: string; } | { name: string; isLink: boolean; link?: undefined; })[]; }; };
  public number;

  constructor( private _orderManagementService: OrderManagementService) { }

  ngOnInit(): void {
    this.number = 7
    
    this._orderManagementService.getOrders().subscribe((res=>{
      this.orders = res.resultObj;
      console.log("get all orders", res);
      this.orders.forEach((order) =>{
        order.createdDate =order.createdDate.substring(0,10);
      });
    }))

    // this.orders.forEach((order) =>{
    //   console.log(order.createdDate.substring(0,10));
       
    // });

    this.contentHeader = {
      headerTitle: 'Category',
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
            name: 'Order',
            isLink: true,
            link: '/'
          },
          {
            name: 'Manager',
            isLink: false
          }
        ]
      }
    };
  }

}
