import { DatePipe } from '@angular/common';
import { Component, OnInit , ViewEncapsulation} from '@angular/core';
import Swal  from 'sweetalert2';
import { EcommerceManagerService } from 'app/main/apps/ecommerce/ecommerce-manager/ecommerce-manager.service';
import { HttpErrorResponse } from '@angular/common/http';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ecommerce-add',
  templateUrl: './ecommerce-add.component.html',
  styleUrls: ['./ecommerce-add.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EcommerceAddComponent implements OnInit {
  public contentHeader: object;
  typeAction: any;
  closeResult: string;
  constructor(private _ecommerceManagerService: EcommerceManagerService,
    private modalService:NgbModal
    ) { }

  currentUser = JSON.parse(localStorage.getItem("currentUser")).user.userName;

  public nameProduct;
  public categoryId;
  public brandId;
  public price;
  public quantity;
  public expire;
  public description;
  public image;

  public categoryName;

  public categoryIdInAddBrand;

 // quantityPtn = '^[1-9]+$';
  quantityPtn = '^[1-9][0-9]*$';
  //pricePtn = '^([0]{1}\.{1}[0-9]+|[1-9]{1}[0-9]*\.{1}[0-9]+|[1-9]+)$';
  pricePtn = '^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$';

  datePipe: DatePipe = new DatePipe('en-US');
  currentDate = new Date();
  transformDate= this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');

  public brandtemp;
  public categories;
  public brands;

  onChangeCategory(e){
    console.log(e.target.value);
    this.getBrandByCategoryId(e.target.value);
    this.categoryId = e.target.value;
    // console.log("date", this.transformDate);
  }

  onChangeBrand(ev){
    console.log(ev.target.value);
    this.brandId = ev.target.value;
  }

  getBrandByCategoryId(cateid: number){
    this.brandtemp = this.brands.filter(x=>x.categoryId == cateid);
  }

  upload(e : any){
    this.image = e.target.files[0]
  }

  submit(form){
    var product = {
      "name":this.nameProduct,
      "createdBy":this.currentUser,
      "updatedDate": this.transformDate,
      "updatedBy":this.currentUser,
      "categoryId": this.categoryId,
      "brandId": this.brandId,
      "price": this.price,
      "quantity": this.quantity,
      //"expire": this.expire,
      "description": this.description,
      //"image": this.image
    }

//console.log(form.value.expire);
//console.log(this.transformDate.substring(0,10));


    try{
      if(form.valid){
        this._ecommerceManagerService.createProduct(product).subscribe(respone=>{
          console.log("Create product", respone)
          if(respone.isSuccessed)
          {
            this._ecommerceManagerService.getDataTableRows();
            let formData = new FormData();
            formData.append('fileInput',this.image);
            this._ecommerceManagerService.onUploadAvatar(respone.resultObj.id, formData).subscribe(res=>{
              console.log(res);

            })
            Swal.fire("Success",respone.message,"success")
          }
          else{
            Swal.fire("Error",respone.message,"error")
          }
        },
        (error: HttpErrorResponse)=>{
          Swal.fire("Error",error.error,"error")
        }
        );
      }
    }
    catch(e){
      Swal.fire("Error",e,"error")
    }

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
            name: 'Add',
            isLink: false
          }
        ]
      }
    };

    this._ecommerceManagerService.getCategory().subscribe(respone=>{
      this.categories = respone.resultObj;
    });

    //this.categoryId = this.categories[0].id;

    this._ecommerceManagerService.getBrand().subscribe(respone=>{
      this.brands = respone.resultObj;
    });

    this.expire = this.transformDate.substring(0,10);
    // console.log(this.transformDate.substring(0,10));
    

    //Swal.fire("Success","respone.message","success")
  }

  open(content,type) {

    this.categoryName = "";

    //If add contact then reset null data
    if(type == 'Add Category' )
    {
      this.categoryName = "";

    }
    // console.log('txt : ',type);
    this.typeAction = type
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

  AddCategory(){
    console.log("Category name", this.categoryName);
    let categoryForCreate= {
      name: this.categoryName,
      createdBy: this.currentUser,
      // updatedDate: this.transformDate,
      updatedBy: this.currentUser
    }
    this._ecommerceManagerService.addCategory(categoryForCreate).subscribe((response =>{
      if(response.isSuccessed)
      {
        Swal.fire("Success",response.message,"success")
        this._ecommerceManagerService.getCategory().subscribe(respone=>{
          this.categories = respone.resultObj;
        });
        this.modalService.dismissAll();
      }
      else
        Swal.fire("Error",response.message,"error")
    }))
  }

  AddBrand(){
    console.log("Brand name", this.categoryName);
    let brandForCreate= {
      name: this.categoryName,
      createdBy: this.currentUser,
      updatedDate: this.transformDate,
      updatedBy: this.currentUser,
      categoryId: this.categoryId
    }
    this._ecommerceManagerService.addBrand(brandForCreate).subscribe((response =>{
      if(response.isSuccessed)
      {
        Swal.fire("Success",response.message,"success")

        this._ecommerceManagerService.getBrand().subscribe(respone=>{
          this.brands = respone.resultObj;
          this.brandtemp = this.brands.filter(x=>x.categoryId == this.categoryId);
        });

        this.modalService.dismissAll();
      }
      else
        Swal.fire("Error",response.message,"error")
    }))
  }
}
