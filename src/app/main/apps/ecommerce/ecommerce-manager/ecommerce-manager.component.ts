import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import { Component, OnInit, ViewChild, ViewEncapsulation,Input } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import Swal  from 'sweetalert2/dist/sweetalert2.js';

import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { EcommerceManagerService } from 'app/main/apps/ecommerce/ecommerce-manager/ecommerce-manager.service';
@Component({
  selector: 'app-ecommerce-manager',
  templateUrl: './ecommerce-manager.component.html',
  styleUrls: ['./ecommerce-manager.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EcommerceManagerComponent implements OnInit {
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
  constructor(private _ecommerceManagerService: EcommerceManagerService, 
    private _ecommerceService: EcommerceService, 
    private _httpClient: HttpClient) { 
    this._unsubscribeAll = new Subject();
    this.onDatatablessChanged = new BehaviorSubject({});
  }

  //DeleteProduct Authenticate Role : Mod
  deleteProduct(id: number){

    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._ecommerceManagerService.deleteProduct(id).subscribe(respone=>{
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
    this._ecommerceManagerService.onDatatablessChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.rows = response;
      this.tempData = this.rows;
    });
    
  }
  

}
