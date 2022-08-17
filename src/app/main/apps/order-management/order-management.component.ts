import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode } from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2';
import { OrderManagementService } from './order-management.service';

import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

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
  .text-secondary-d1 {
    color: #728299!important;
  }
  .page-header {
      margin: 0 0 1rem;
      padding-bottom: 1rem;
      padding-top: .5rem;
      border-bottom: 1px dotted #e2e2e2;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-pack: justify;
      justify-content: space-between;
      -ms-flex-align: center;
      align-items: center;
  }
  .page-title {
      padding: 0;
      margin: 0;
      font-size: 1.75rem;
      font-weight: 300;
  }
  .brc-default-l1 {
      border-color: #dce9f0!important;
  }

  .ml-n1, .mx-n1 {
      margin-left: -.25rem!important;
  }
  .mr-n1, .mx-n1 {
      margin-right: -.25rem!important;
  }
  .mb-4, .my-4 {
      margin-bottom: 1.5rem!important;
  }

  hr {
      margin-top: 1rem;
      margin-bottom: 1rem;
      border: 0;
      border-top: 1px solid rgba(0,0,0,.1);
  }

  .text-grey-m2 {
      color: #888a8d!important;
  }

  .text-success-m2 {
      color: #86bd68!important;
  }

  .font-bolder, .text-600 {
      font-weight: 600!important;
  }

  .text-110 {
      font-size: 110%!important;
  }
  .text-blue {
      color: #478fcc!important;
  }
  .pb-25, .py-25 {
      padding-bottom: .75rem!important;
  }

  .pt-25, .py-25 {
      padding-top: .75rem!important;
  }
  .bgc-default-tp1 {
      background-color: rgba(121,169,197,.92)!important;
  }
  .bgc-default-l4, .bgc-h-default-l4:hover {
      background-color: #f3f8fa!important;
  }
  .page-header .page-tools {
      -ms-flex-item-align: end;
      align-self: flex-end;
  }

  .btn-light {
      color: #757984;
      background-color: #f5f6f9;
      border-color: #dddfe4;
  }
  .w-2 {
      width: 1rem;
  }

  .text-120 {
      font-size: 120%!important;
  }
  .text-primary-m1 {
      color: #4087d4!important;
  }

  .text-danger-m1 {
      color: #dd4949!important;
  }
  .text-blue-m2 {
      color: #68a3d5!important;
  }
  .text-150 {
      font-size: 150%!important;
  }
  .text-60 {
      font-size: 60%!important;
  }
  .text-grey-m1 {
      color: #7b7d81!important;
  }
  .align-bottom {
      vertical-align: bottom!important;
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

  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  searchText;

  public page = 1;
  public pageSize = 10;

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

  SetPageSize(value){
    this.pageSize=value;
    console.log(this.pageSize);
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

  openInvoice(invoice){
    console.log("order id invoice ", this.selectedorderDetail);
    
    this.modalService.open(invoice, {ariaLabelledBy: 'modal-basic-title', size:'lg'}).result.then((result) => {
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

  convetToPDF() {
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
        // Few necessary setting options
        var imgWidth = 208;
        var pageHeight = 295;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;
        const contentDataURL = canvas.toDataURL('image/png')
        let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
        var position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
        pdf.save('Order_'+ this.selectedOrder.id +'_date_'+ this.selectedOrder.createdDate + '.pdf'); // Generated PDF
    });
  }

}
