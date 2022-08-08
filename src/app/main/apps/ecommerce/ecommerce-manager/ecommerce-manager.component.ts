import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import { Component, OnInit, ViewChild, ViewEncapsulation,Input, ElementRef } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import Swal  from 'sweetalert2/dist/sweetalert2.js';

import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as XLSX from 'xlsx';

declare var require: any;
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


import { EcommerceManagerService } from 'app/main/apps/ecommerce/ecommerce-manager/ecommerce-manager.service';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
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

  public startDay;
  public endDay;
  currentDate = new Date();
  public listReport;
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
            this._ecommerceManagerService.getDataTableRows();
            Swal.fire("Success",respone.message,"success")
            //window.location.reload();
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
    // const temp = this.tempData.filter(function (d) {
    //   return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    // });
    const temp = this.tempData.filter(function (d) {

      return d.brand["name"].toLowerCase().indexOf(val) !== -1 ||

      d.category["name"].toLowerCase().indexOf(val) !== -1 ||

      d.name.toLowerCase().indexOf(val) !== -1 || !val;

    });

    // Update The Rows
    this.rows = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  loadListReport() {
    if (this.startDay == null && this.endDay == null) {
      this.startDay="01/01/1970";
      this.endDay="01/01/2038";
    }
    else if(this.startDay==null){
      this.startDay="01/01/1970";
    }
    else if(this.endDay==null){
      this.endDay="01/01/2038";
    }

    console.log(this.startDay);
    console.log(this.endDay);
    if(this.startDay>this.endDay){
      Swal.fire("Success","Start day must be less than End day");
    }

    var startDay = Math.round(Date.parse(this.startDay) / 1000);
      console.log(this.startDay);
      var endDay = Math.round(Date.parse(this.endDay) / 1000);
      this._ecommerceManagerService
        .reportExcel(startDay, endDay)
        .subscribe((reponse) => {
          console.log(reponse);
          this.listReport = reponse.resultObj;
        });
  }

  exportExcel(): void {
    if(this.startDay == null && this.endDay == null){
      this.loadListReport();
    }
    var fileName = this.currentDate.toString()+'_ReportProduct.xlsx';
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, fileName);
  }

  @ViewChild('content') pdfTable: ElementRef;
  exportPDF():void{
    if(this.startDay == null && this.endDay == null){
      this.loadListReport();
    }
    var fileName = this.currentDate.toString()+'_ReportProduct';
    const pdfTable = this.pdfTable.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).download(fileName);
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
