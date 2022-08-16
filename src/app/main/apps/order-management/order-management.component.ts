import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { OrderManagementService } from './order-management.service';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss'],
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
  public numberOrderWaiting;
  public numberOrderConfirmed;
  public numberOrderShipping;
  public numberOrderArrived;
  public numberOrderCancelled;
  public numberOrderReturns;
  closeResult: string;

  public selectedOrder;
  public selectedorderDetail;
  public isChangeStatusOrder;
  public statusOrders;
  public statusOrderId;
  selectedOrderChangeStatusId: any;


  constructor( private _orderManagementService: OrderManagementService, private modalService:NgbModal) { }

  getAllOrders(){
    this._orderManagementService.getOrders().subscribe((res=>{
      this.orders = res.resultObj;
      this.orders.forEach((order) =>{
        order.createdDate =order.createdDate.substring(0,10);
        switch(order.statusOrderId) { 
          case 1: { 
            order.status = 'waiting';
             break; 
          } 
          case 2: { 
            order.status = 'confirmed';
             break; 
          } 
          case 3: { 
            order.status = 'shipping';
             break; 
          } 
          case 4: { 
            order.status = 'arrived';
             break; 
          } 
          case 5: { 
            order.status = 'cancelled';
             break; 
          } 
          case 6: { 
            order.status = 'returns';
             break; 
          } 
          default: { 
            order.status = 'other';
             break; 
          } 
        };
      });
      console.log("get all orders", this.orders);

      this.numberOrderWaiting = this.orders.filter(x=>x.statusOrderId == 1).length;
      this.numberOrderConfirmed = this.orders.filter(x=>x.statusOrderId == 2).length;
      this.numberOrderShipping = this.orders.filter(x=>x.statusOrderId == 3).length;
      this.numberOrderArrived = this.orders.filter(x=>x.statusOrderId == 4).length;
      this.numberOrderCancelled = this.orders.filter(x=>x.statusOrderId == 5).length;
      this.numberOrderReturns = this.orders.filter(x=>x.statusOrderId == 6).length;
    }))
  }

  ngOnInit(): void {
    this.isChangeStatusOrder = false;
    this.statusOrderId = 1;

    this.getAllOrders();

    this._orderManagementService.getAllStatusOrders().subscribe((res=>{
      this.statusOrders = res.resultObj;
      console.log("Status Orders ", this.statusOrders);
      
    }))
    

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

  open(content,orderId) {
    console.log("order id", orderId);
    
    this._orderManagementService.getOrderById(orderId).subscribe((res=>{
      this.selectedOrder = res.resultObj;
      this.selectedOrder.createdDate = this.selectedOrder.createdDate.substring(0,10);
      switch(this.selectedOrder.statusOrderId) { 
        case 1: { 
          this.selectedOrder.status = 'waiting';
           break; 
        } 
        case 2: { 
          this.selectedOrder.status = 'confirmed';
           break; 
        } 
        case 3: { 
          this.selectedOrder.status = 'shipping';
           break; 
        } 
        case 4: { 
          this.selectedOrder.status = 'arrived';
           break; 
        } 
        case 5: { 
          this.selectedOrder.status = 'cancelled';
           break; 
        } 
        case 6: { 
          this.selectedOrder.status = 'returns';
           break; 
        } 
        default: { 
          this.selectedOrder.status = 'other';
           break; 
        } 
     } 
  
      console.log("order", this.selectedOrder);
    }))

    this._orderManagementService.getAllOrderDetailByOrderId(orderId).subscribe((res=>{
      this.selectedorderDetail = res.resultObj;
      this.selectedOrder.total = 0;
      this.selectedorderDetail.forEach((order) =>{
        if(order.discount != 0)
          this.selectedOrder.total += order.price * order.quantity * (1 - order.discount/100);
        else
          this.selectedOrder.total += order.price * order.quantity;
        });
      // this.selectedOrder.total =  this.selectedOrder.total.toFixed(2);
      console.log("order detail", res.resultObj);
    }))

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size:'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ChangeStatusOrder(orderId){
    this.isChangeStatusOrder = true;
    this.selectedOrderChangeStatusId = orderId;
  }

  SaveChangeStatusOrder(orderId){
    this.isChangeStatusOrder = false;
    this.selectedOrderChangeStatusId = null;
    console.log("select change status ", this.statusOrderId);
    this._orderManagementService.getOrderById(orderId).subscribe((res=>{
      this.selectedOrder = res.resultObj;
      console.log("selected Order ", this.selectedOrder.statusOrderId);

      if(this.statusOrderId != this.selectedOrder.statusOrderId){
        this._orderManagementService.changeStatusOrder(orderId, this.statusOrderId).subscribe((res=>{
          if(res.isSuccessed)
          {
            Swal.fire("Success", res.message, "success");
            this.getAllOrders();
          }
          else
            Swal.fire("Error", res.message, "error");
        }));
      }
    }));
    
  }

  Reset(){
    this.isChangeStatusOrder = false;
    this.selectedOrderChangeStatusId = null;
    this.getAllOrders();
  }
}
