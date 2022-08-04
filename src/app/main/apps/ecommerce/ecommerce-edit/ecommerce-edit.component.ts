import { id } from '@swimlane/ngx-datatable';
import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import { Component, OnInit, ViewEncapsulation, OnChanges, Input } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { EcommerceEditService } from './ecommerce-edit.service';
import { NgForm } from '@angular/forms';
import { CategoryAPI } from './../api-models/Categories/CategoryAPI';

import { DatePipe } from '@angular/common';
import Swal  from 'sweetalert2';

@Component({
  selector: 'app-ecommerce-edit',
  templateUrl: './ecommerce-edit.component.html',
  styleUrls: ['./ecommerce-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EcommerceEditComponent implements OnInit {
  public product;

  public url = this.router.url;
  public urlLastValue;
  public rows;
  public contentHeader: object;
  public categories;
  public brands;
  public brandId;
  public categoryId;
  public brandtemp;

  public id;
  public image=null;

  quantityPtn = '^[1-9][0-9]*$';

  //pricePtn = '^([0]{1}\.{1}[0-9]+|[1-9]{1}[0-9]*\.{1}[0-9]+|[1-9]+)$';
  pricePtn = '^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$';


  currentUser = JSON.parse(localStorage.getItem("currentUser")).user.userName;

  datePipe: DatePipe = new DatePipe('en-US');
  currentDate = new Date();
  transformDate= this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');

  public birthDateOptions: FlatpickrOptions = {
    altInput: true
  };

  public selectMultiLanguages = ['English', 'Spanish', 'French', 'Russian', 'German', 'Arabic', 'Sanskrit'];
  public selectMultiLanguagesSelected = [];

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(private router: Router,private route:ActivatedRoute, private _ecommerceEditService: EcommerceEditService, private _ecommerceService: EcommerceService) {
    this._unsubscribeAll = new Subject();
    this.urlLastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
  }

  ngOnInit(): void {

    this.contentHeader = {
      headerTitle: 'Manager',
      actionButton: false,
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
            name: 'Edit',
            isLink: false
          }
        ]
      }
    };

    this._ecommerceEditService.onDataChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.rows = response;
      console.log(this.rows);
    });

    this._ecommerceEditService.getCategory().subscribe(respone=>{
      this.categories = respone.resultObj;
    console.log(this.categories);
    });



    this._ecommerceEditService.getBrand().subscribe(respone=>{
      this.brands = respone.resultObj;
      this.route.paramMap.subscribe(params => {
        this.id = params.get('id');
        console.log(this.id);
        var row=this.rows.filter(r => r.id==this.id);
        this.brandtemp= this.brands.filter(x=>x.categoryId ==row[0].categoryId);
      })
    });

  }
  update(form: NgForm){
    var currentProduct = {
      "name":form.value.name,
      "updatedDate": this.transformDate,
      "updatedBy":this.currentUser,
      // "createdDate": this.transformDate,
      // "createdBy": this.currentUser,
      "categoryId": form.value.categoryId,
      "brandId": form.value.brandId,
      "price": form.value.price,
      "quantity": form.value.quantity,
      "expire": form.value.expire,
      "description": form.value.description,
      //"slug": "/product"
      //"image": this.image
    }

    console.log(currentProduct);
    this._ecommerceEditService.updateProduct(currentProduct, this.id).subscribe(respone => {
      console.log("Update product", respone);
      if(respone.isSuccessed)
      {
        if(this.image!=null){
          let formData = new FormData();
          formData.append('fileInput',this.image);
          this._ecommerceEditService.onUploadAvatar(this.id, formData).subscribe(res=>{
          console.log(res);
          })
        }
        Swal.fire("Success",respone.message,"success")
      }
      else{
        Swal.fire("Error",respone.message,"error")
      }
  });
}

onChangeCategory(e){
  console.log(e.target.value);
  this.getBrandByCategoryId(e.target.value);
  this.categoryId = e.target.value;
}



onChangeBrand(ev){
  console.log(ev.target.value);
  this.brandId = ev.target.value;
}



getBrandByCategoryId(cateid: number){
  this.brandtemp = this.brands.filter(x=>x.categoryId == cateid);
}

GetBrand(value){
  console.log(value);
  this.brandtemp = this.brands.filter(x=>x.categoryId == value);
}

  upload(e : any){
    if(e.target.files[0]){
      this.image = e.target.files[0];
      var reader=new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=>{
        const imgProduct=document.getElementById("imgProduct") as HTMLInputElement | null;
        if(imgProduct!=null){
          imgProduct.src=event.target.result;
        }
      };
    }
    else{
      this.image=null;
    }
  }
}
