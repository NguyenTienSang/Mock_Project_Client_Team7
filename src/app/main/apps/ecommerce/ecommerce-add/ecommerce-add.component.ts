import { DatePipe } from '@angular/common';
import { Component, OnInit , ViewEncapsulation} from '@angular/core';
import Swal  from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-ecommerce-add',
  templateUrl: './ecommerce-add.component.html',
  styleUrls: ['./ecommerce-add.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EcommerceAddComponent implements OnInit {
  public contentHeader: object;
  constructor() { }

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
  categories = [
    {id: 1, name: "Category 1"},
    {id: 2, name: "Category 2"},
    {id: 3, name: "Category 3"},
    {id: 4, name: "Category 4"}
  ]
  brands = [
    {id: 1, name: "Brand 1", categoryId: 1},
    {id: 2, name: "Brand 2", categoryId: 1},
    {id: 3, name: "Brand 3", categoryId: 2},
    {id: 4, name: "Brand 4", categoryId: 3},
    {id: 5, name: "Brand 5", categoryId: 4},
    {id: 6, name: "Brand 6", categoryId: 3},
    {id: 7, name: "Brand 7", categoryId: 2}
  ]

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
      "expire": this.expire,
      "description": this.description,
      "image": this.image
    }
    console.log("product create", product);
    Swal.fire("Success","Create product","success")
    console.log("current user", this.currentUser);
    
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
  }

}
