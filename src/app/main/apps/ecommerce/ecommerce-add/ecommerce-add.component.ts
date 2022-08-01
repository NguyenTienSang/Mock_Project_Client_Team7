import { DatePipe } from '@angular/common';
import { Component, OnInit , ViewEncapsulation} from '@angular/core';
import Swal  from 'sweetalert2';
import { EcommerceManagerService } from 'app/main/apps/ecommerce/ecommerce-manager/ecommerce-manager.service';

@Component({
  selector: 'app-ecommerce-add',
  templateUrl: './ecommerce-add.component.html',
  styleUrls: ['./ecommerce-add.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EcommerceAddComponent implements OnInit {
  public contentHeader: object;
  constructor(private _ecommerceManagerService: EcommerceManagerService) { }

  currentUser = JSON.parse(localStorage.getItem("currentUser")).user.userName;

  public nameProduct;
  public categoryId;
  public brandId;
  public price;
  public quantity;
  public expire;
  public description;
  public image;

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

  submit(){
    var product = {
      "name":this.nameProduct,
      "createdBy":this.currentUser,
      "updatedDate": this.transformDate,
      "updatedBy":this.currentUser,
      "categoryId": this.categoryId,
      "brandId": this.brandId,
      "price": this.price,
      "quantity": this.quantity,
      "expire": this.expire,
      "description": this.description,
      //"image": this.image
    }
    
    this._ecommerceManagerService.createProduct(product).subscribe(respone=>{
      console.log("Create product", respone)
      if(respone.isSuccessed)
      {
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
    });
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

    this._ecommerceManagerService.getBrand().subscribe(respone=>{
      this.brands = respone.resultObj;
    });

    //Swal.fire("Success","respone.message","success")
  }
}
