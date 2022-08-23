import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { VoucherService } from '../voucher.service';
import Swal  from 'sweetalert2';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-voucher-manager',
  templateUrl: './voucher-manager.component.html',
  styleUrls: ['./voucher-manager.component.scss']
})
export class VoucherManagerComponent implements OnInit {
  public contentHeader: object;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  searchText;

  public voucherName;
  public discount;
  public quantity;
  public conditionDiscount;
  public expiredDay;
  public expiredDateOld;
  public voucherId;


  public page = 1;
  public pageSize = 10;

  typeAction: any;
  closeResult: string;

  public voucherList=[];

  discountPtn = '^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$';
  quantityPtn = '^[1-9][0-9]*$';

  currentDate = new Date();

  constructor(private modalService:NgbModal, private _voucherService:VoucherService) { }

  SetPageSize(value){
    this.pageSize=value;
  }

  openCreate(content){
    this.voucherName="";
    this.discount="";
    this.quantity="";
    this.conditionDiscount="";
    this.expiredDay=new Date();
    //If add contact then reset null dat
    this.typeAction ="Add Voucher";
  // console.log('txt : ',type);
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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

  checkdate(){
    if(formatDate(this.expiredDay,'yyyy-MM-dd','en_US')<formatDate(new Date(),'yyyy-MM-dd','en_US')){
      Swal.fire("Warning","Expiration date must be less than current date!");
      console.log(this.currentDate);
    console.log(this.expiredDay);
    }
  }

  AddVoucher(){
    if(formatDate(this.expiredDay,'yyyy-MM-dd','en_US')<formatDate(new Date(),'yyyy-MM-dd','en_US')){
      Swal.fire("Warning","Expiration date must be less than current date!");
      return;
    }
    let voucherForCreate= {
      name: this.voucherName,
      discount: this.discount,
      quantity:this.quantity,
      conditionDiscount: this.conditionDiscount,
      expiredDate:this.expiredDay
    }

    this._voucherService.addVoucher(voucherForCreate).subscribe((response =>{
      if(response.isSuccessed)
      {
        Swal.fire("Success",response.message,"success")
        this.modalService.dismissAll();
        this.GetAllVoucher();
      }
      else
        Swal.fire("Error",response.message,"error")
    }))
  }

  openUpdate(content, item)
  {
    this.typeAction ="Update Brand";
    this.voucherId=item.id;
    this.voucherName=item.name;
    this.discount=item.discount;
    this.quantity=item.quantity;
    this.expiredDateOld=item.expiredDate;
    this.expiredDay=item.expiredDate;
    // console.log('txt : ',type);
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  UpdateVoucher(){
    if(formatDate(this.expiredDay,'yyyy-MM-dd','en_US')<formatDate(this.expiredDateOld,'yyyy-MM-dd','en_US')){
      Swal.fire("Warning","Expiration date must be less than expiration date old!");
      return;
    }

    let voucherForUpdate= {
      name: this.voucherName,
      discount: this.discount,
      quantity:this.quantity,
      expiredDate:this.expiredDay
    }

    this._voucherService.updateVoucher(this.voucherId,voucherForUpdate).subscribe(response=>{
      if(response.isSuccessed)
      {
        Swal.fire("Success",response.message,"success")
        this.modalService.dismissAll();
        this.GetAllVoucher();
      }
      else
        Swal.fire("Error",response.message,"error")
    });
  }

  private GetAllVoucher(){
    this._voucherService.getVouchers().subscribe(reponse=>{
      this.voucherList= reponse.resultObj;
      console.log(this.voucherList);
    })
  }

  DeleteVoucher(value){
    this._voucherService.deleteVoucher(value).subscribe(response => {
      if(response.isSuccessed)
      {
        Swal.fire("Success",response.message,"success")
        this.modalService.dismissAll();
        this.GetAllVoucher();
      }
      else
        Swal.fire("Error",response.message,"error")
    });
  }

  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  ngOnInit(): void {
    this.GetAllVoucher();

    this.contentHeader = {
      headerTitle: 'Voucher',
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
            name: 'Voucher',
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
