import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserOrderDetailService } from './user-order-detail.service';

@Component({
  selector: 'app-user-order-detail',
  templateUrl: './user-order-detail.component.html',
  styleUrls: ['./user-order-detail.component.scss'],
  styles: [`
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
export class UserOrderDetailComponent implements OnInit {

  currentStep = 1;
  numSteps = 5;

  public url = this.router.url;
  public urlLastValue;

  public selectedOrder;
  public selectedOrderDetail;
  
  constructor(private router: Router, private _userOrderDetailService: UserOrderDetailService) 
  { 
    this.urlLastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
  }

  ngOnInit(): void {
    console.log("order id: ", this.urlLastValue);

    this._userOrderDetailService.getOrderById(this.urlLastValue).subscribe((res=>{
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

      console.log("order status", this.selectedOrder.status.toUpperCase());

      this.nextStep(this.selectedOrder.statusOrderId);

      this._userOrderDetailService.getAllOrderDetailByOrderId(this.urlLastValue).subscribe((res=>{
        this.selectedOrderDetail = res.resultObj;
        this.selectedOrder.total = 0;
        this.selectedOrderDetail.forEach((order) =>{
          if(order.discount != 0)
            this.selectedOrder.total += order.price * order.quantity * (1 - order.discount/100);
          else
            this.selectedOrder.total += order.price * order.quantity;
          });
        // this.selectedOrder.total =  this.selectedOrder.total.toFixed(2);
        console.log("order detail", this.selectedOrderDetail);

        console.log("order total", this.selectedOrder.total);
      }))
    })) 
  }

  UserCancelOrder(){
    Swal.fire({
      title: 'Cancel order!',
      text: 'Are you sure want to cancel?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this._userOrderDetailService.cancelOrder(this.selectedOrder.id, 5).subscribe(respone=>{
          // console.log("delete",respone);
          if(respone.isSuccessed){
            Swal.fire("Success",respone.message,"success")
            this._userOrderDetailService.getOrderById(this.urlLastValue).subscribe((res=>{
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
        
              console.log("order status", this.selectedOrder.status.toUpperCase());
        
              this.nextStep(0);
        
              this._userOrderDetailService.getAllOrderDetailByOrderId(this.urlLastValue).subscribe((res=>{
                this.selectedOrderDetail = res.resultObj;
                this.selectedOrder.total = 0;
                this.selectedOrderDetail.forEach((order) =>{
                  if(order.discount != 0)
                    this.selectedOrder.total += order.price * order.quantity * (1 - order.discount/100);
                  else
                    this.selectedOrder.total += order.price * order.quantity;
                  });
                // this.selectedOrder.total =  this.selectedOrder.total.toFixed(2);
                console.log("order detail", this.selectedOrderDetail);
        
                console.log("order total", this.selectedOrder.total);
              }))
            })) 
          }
          else{
            Swal.fire("Error",respone.message,"error")
          }
        },(error=>{
          Swal.fire("Error",error,"error")
        })
        );
      }
    })
  }

  nextStep(step:number) {
    this.currentStep = step+1;
    if (this.currentStep > this.numSteps) {
      this.currentStep = 1;
    }
    var stepper = document.getElementById("stepper1");
    var steps = stepper.getElementsByClassName("step");

    Array.from(steps).forEach((step, index) => {
      let stepNum = index + 1;
      if (stepNum === this.currentStep) {
        this.addClass(step, "editing");
      } else {
        this.removeClass(step, "editing");
      }
      if (stepNum < this.currentStep) {
        this.addClass(step, "done");
      } else {
        this.removeClass(step, "done");
      }
    });
  }
  hasClass(elem, className) {
    return new RegExp(" " + className + " ").test(" " + elem.className + " ");
  }

  addClass(elem, className) {
    if (!this.hasClass(elem, className)) {
      elem.className += " " + className;
    }
  }

  removeClass(elem, className) {
    var newClass = " " + elem.className.replace(/[\t\r\n]/g, " ") + " ";
    if (this.hasClass(elem, className)) {
      while (newClass.indexOf(" " + className + " ") >= 0) {
        newClass = newClass.replace(" " + className + " ", " ");
      }
      elem.className = newClass.replace(/^\s+|\s+$/g, "");
    }
  }

  // convetToPDF() {
  //   var data = document.getElementById('contentToConvert');
  //   html2canvas(data).then(canvas => {
  //       // Few necessary setting options
  //       var imgWidth = 208;
  //       var pageHeight = 295;
  //       var imgHeight = canvas.height * imgWidth / canvas.width;
  //       var heightLeft = imgHeight;
  //       const contentDataURL = canvas.toDataURL('image/png')
  //       let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
  //       var position = 0;
  //       pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
  //       pdf.save('new-file.pdf'); // Generated PDF
  //   });
  // }

}
