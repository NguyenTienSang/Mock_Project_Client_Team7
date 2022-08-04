import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import { Component, OnInit, ViewChild, ViewEncapsulation,Input } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import Swal  from 'sweetalert2/dist/sweetalert2.js';

import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EcommerceDeleteService } from './ecommerce-delete.service';

@Component({
  selector: 'app-ecommerce-delete',
  templateUrl: './ecommerce-delete.component.html',
  styleUrls: ['./ecommerce-delete.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EcommerceDeleteComponent implements OnInit {
  @Input() product;
  public data: any;
  public contentHeader: object;
  public selectedOption = 10;
  public rows;
  public ColumnMode = ColumnMode;
  public onDatatablessChanged: BehaviorSubject<any>;
  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;
  constructor(private _ecommerceDeleteService: EcommerceDeleteService, 
    private _ecommerceService: EcommerceService, 
    private _httpClient: HttpClient) { 
    this._unsubscribeAll = new Subject();
    this.onDatatablessChanged = new BehaviorSubject({});
  }

  // //RestoreProduct Authenticate Role : Mod
  // restoreProduct(id: number): Promise<any[]> {
  //   if(confirm("Are you sure to restore?")){
  //     return new Promise((resolve, reject) => {
  //       const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  //        const headers = new HttpHeaders({
  //          'Content-Type': 'application/json',
  //          'Authorization': `Bearer ` + currentUser.resultObj
  //        })
  //        this._httpClient.delete(`${environment.apiUrl}/api/Products/RestoreProduct` +'/' + id, { headers: headers }).subscribe(data => {
  //          window.location.reload();
  //        });
  //  });
  //   }
  // }

  //RestoreProduct Authenticate Role : Mod, Master
  restoreProduct(id: number){

    Swal.fire({
      title: 'Are you sure want to restore?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, restore it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._ecommerceDeleteService.restoreProduct(id).subscribe(respone=>{
          console.log("delete",respone);
          if(respone.isSuccessed){
            Swal.fire("Success",respone.message,"success")
            window.location.reload();
          }
          else{
            Swal.fire("Error",respone.message,"error")
          }
        },(error=>{
          Swal.fire("Error",error,"error")
        })
        );
      } 
      // else if (result.dismiss === Swal.DismissReason.cancel) {
      //   Swal.fire(
      //     'Cancelled',
      //     'Your imaginary file is safe :)',
      //     'error'
      //   )
      // }
    })
  }

  //RestoreProduct Authenticate Role : Mod, Master
  deletePermanentlyProduct(id: number){

    Swal.fire({
      title: 'Are you sure want to delete?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._ecommerceDeleteService.deletePermanentlyProduct(id).subscribe(respone=>{
          console.log("delete",respone);
          if(respone.isSuccessed){
            Swal.fire("Success",respone.message,"success")
            window.location.reload();
          }
          else{
            Swal.fire("Error",respone.message,"error")
          }
        },(error=>{
          Swal.fire("Error",error,"error")
        })
        );
      } 
      // else if (result.dismiss === Swal.DismissReason.cancel) {
      //   Swal.fire(
      //     'Cancelled',
      //     'Your imaginary file is safe :)',
      //     'error'
      //   )
      // }
    })
  }

  /**
   * filterUpdate
   *
   * @param event
   */
   filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // Update The Rows
    this.rows = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Manager',
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
            name: 'eCommerce',
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
    this._ecommerceDeleteService.onDatatablessChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.rows = response;
      this.tempData = this.rows;
    });
    //Swal.fire("Success","Create product","success")
  }
}