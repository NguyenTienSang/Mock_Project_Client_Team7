import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER } from '@angular/cdk/overlay/overlay-directives';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import { environment } from 'environments/environment';
import { EcommerceShopComponent } from '../ecommerce-shop.component';
import { filter } from 'rxjs/operators';
import { id } from '@swimlane/ngx-datatable';
import { Elements } from 'plyr';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { arrays2csv } from '@ctrl/ngx-csv';
import { element } from 'protractor';

@Component({
  selector: 'ecommerce-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['../ecommerce-shop.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EcommerceSidebarComponent implements OnInit {
  public categories;
  public brands;
  public products;
  brandList;
  productNew;
  checkedAll = false;
  idCategory="";
  idBrandList=[];
  idBrand="";
  productPrice;

  idPrice;
  clear = null;
  // Public
  public sliderPriceValue = [1, 2];

  constructor(private _httpClient: HttpClient,private _ecommerceService: EcommerceService, private _e:EcommerceShopComponent) {}

  ngOnInit(): void {
      this.categories = this._ecommerceService.categoryList;
      this.products=this._ecommerceService.productList;
      this.brandList=this._ecommerceService.brandList;
      this.brands=this.brandList.filter((element, index) => {
        return this.brandList.indexOf(element) === index;
      });
      console.log(this.brands);
  }

  reload(){
    this.checkedAll = false;
    this._httpClient.get(`${environment.apiUrl}/api/Products/GetAllProduct`).subscribe((response: any) => {
      this.products = response.resultObj;
    });
}
  onItemChangeCategory(idCategory){
    this.idBrandList.forEach((element,index)=>{
      const radioBrand=document.getElementById("Brand"+element) as HTMLInputElement | null;
      if(radioBrand!=null){
        radioBrand.checked = false;
      }
    });

    this.idBrandList=[];
    this.idCategory=idCategory;
    this._e.products=this.products;
    this._e.products=this._e.products.filter(x=>x.categoryId===Number(idCategory));
    this._e.productsTemp = this._e.products;

    this.brands=this.brandList.filter(x=>x.categoryId===Number(idCategory));
    console.log(this.brands);

    const radioPrice=document.getElementById(this.idPrice) as HTMLInputElement | null;

  if(radioPrice!=null)
  {
    switch(this.idPrice){
      case "priceAll":
        break;
      case "priceRange1":{
        this._e.products=this._e.products.filter(x=>x.price<=10);
        this._e.productsTemp = this._e.products;
        break;
      }
      case "priceRange2":{
        this._e.products=this._e.products.filter(x=>x.price<100 && x.price>=10);
        this._e.productsTemp = this._e.products;
        break;
      }
      case "priceARange3":{
        this._e.products=this._e.products.filter(x=>x.price<500 && x.price>=100);
        this._e.productsTemp = this._e.products;
        break;
      }
      case "priceRange4":{
        this._e.products=this._e.products.filter(x=>x.price>=500);
        this._e.productsTemp = this._e.products;
        break;
      }
      default:{
        this._e.products=this.products;
        this._e.productsTemp = this.products;
      }
    }
 }
}

 onItemChangeBrand(idBrand){
  this.idBrand=idBrand;
  this._e.products=this.products;
  console.log(idBrand);
  const radioBrand=document.getElementById("Brand"+idBrand.toString()) as HTMLInputElement;
  if(radioBrand.checked){
    this.idBrandList.push(idBrand);
  }
  else{
    this.idBrandList.forEach((element,index) => {
      if(element===idBrand) {
        this.idBrandList.splice(index, 1);
      }
    });
  }

  console.log(this.idBrandList)

  const radioCategry=document.getElementById("Category"+this.idCategory) as HTMLInputElement | null;
  if(radioCategry!=null){
    if(radioCategry.checked){
      this._e.products=this.products;
      this._e.products=this._e.products.filter(x=>x.categoryId===Number(this.idCategory));
      this._e.productsTemp = this._e.products;

      this.brands=this.brandList.filter(x=>x.categoryId===Number(this.idCategory));
    }
  }

  this.productNew=this._e.products;

  console.log(this._e.products);
  this.idBrandList.forEach((element,index)=>{
    if(index==0){
      this.productNew=this._e.products.filter(x=>x.brandId===Number(element));
    }
    else{
      this.productNew=this.productNew.concat(this._e.products.filter(x=>x.brandId===Number(element)));
    }
  });
  this._e.products=this.productNew;
  this._e.productsTemp = this.productNew;
  const radioPrice=document.getElementById(this.idPrice) as HTMLInputElement | null;

  if(radioPrice!=null)
  {
    switch(this.idPrice){
      case "priceAll":
        break;
      case "priceRange1":{
        this._e.products=this._e.products.filter(x=>x.price<=10);
        this._e.productsTemp = this._e.products;
        break;
      }
      case "priceRange2":{
        this._e.products=this._e.products.filter(x=>x.price<100 && x.price>=10);
        this._e.productsTemp = this._e.products;
        break;
      }
      case "priceARange3":{
        this._e.products=this._e.products.filter(x=>x.price<500 && x.price>=100);
        this._e.productsTemp = this._e.products;
        break;
      }
      case "priceRange4":{
        this._e.products=this._e.products.filter(x=>x.price>=500);
        this._e.productsTemp = this._e.products;
        break;
      }
      default:{
        this._e.products=this.products;
        this._e.productsTemp = this.products;
      }
  }

  console.log(this._e.products);
}
}

onItemChangePrice(value){
  console.log(value);
  this.idPrice=value;


  const radioCategry=document.getElementById("Category"+this.idCategory) as HTMLInputElement |null;
  const radioBrand=document.getElementById("Brand"+this.idBrand) as HTMLInputElement |null;

  if(radioCategry==null||!radioCategry.checked){
    if(radioBrand==null||!radioBrand.checked){
      this._e.products=this.products;
      this.productNew=this._e.products;
      console.log(this._e.products);
      this.idBrandList.forEach((element,index)=>{
        if(index==0){
          this.productNew=this._e.products.filter(x=>x.brandId===Number(element));
        }
        else{
          this.productNew=this.productNew.concat(this._e.products.filter(x=>x.brandId===Number(element)));
        }
      });
      this._e.products=this.productNew;
      this._e.productsTemp = this.productNew;
    }
    else{
      this._e.products=this.products;
      this._e.productsTemp = this.products;
    }
  }
  else{
    if(radioBrand==null||!radioBrand.checked){
      this._e.products=this.products;
      this._e.products=this._e.products.filter(x=>x.categoryId===Number(this.idCategory));
      this.brands=this.brandList.filter(x=>x.categoryId===Number(this.idCategory));
      this._e.productsTemp = this._e.products;
    }
    else{
      this._e.products=this.products;
      this._e.products=this._e.products.filter(x=>x.categoryId===Number(this.idCategory));
      this.brands=this.brandList.filter(x=>x.categoryId===Number(this.idCategory));

      this.productNew=this._e.products;
      console.log(this._e.products);
      this.idBrandList.forEach((element,index)=>{
        if(index==0){
          this.productNew=this._e.products.filter(x=>x.brandId===Number(element));
        }
        else{
          this.productNew=this.productNew.concat(this._e.products.filter(x=>x.brandId===Number(element)));
        }
      });
      this._e.products=this.productNew;
      this._e.productsTemp = this.productNew;
    }
  }

  switch(value){
    case "priceAll":
      break;
    case "priceRange1":{
      this._e.products=this._e.products.filter(x=>x.price<=10);
      this._e.productsTemp = this._e.products;
      break;
    }
    case "priceRange2":{
      this._e.products=this._e.products.filter(x=>x.price<100 && x.price>=10);
      this._e.productsTemp = this._e.products;
      break;
    }
    case "priceARange3":{
      this._e.products=this._e.products.filter(x=>x.price<500 && x.price>=100);
      this._e.productsTemp = this._e.products;
      break;
    }
    case "priceRange4":{
      this._e.products=this._e.products.filter(x=>x.price>=500);
      this._e.productsTemp = this._e.products;
      break;
    }
    default:{
      this._e.products=this.products;
      this._e.productsTemp = this.products;
    }
  }
}

  Clear(){
    const radioCategry=document.getElementById("Category"+this.idCategory) as HTMLInputElement | null;
    if(radioCategry!=null){
      radioCategry.checked = false;
    }

    this.idBrandList.forEach((element,index)=>{
      const radioBrand=document.getElementById("Brand"+element) as HTMLInputElement | null;
      if(radioBrand!=null){
        radioBrand.checked = false;
      }
    });

    const radioPrice=document.getElementById(this.idPrice) as HTMLInputElement | null;
    if(radioPrice!=null){
      radioPrice.checked = false;
    }

    this.brands=this.brandList;
    this._e.products=this.products;
    this._e.productsTemp = this.products;
    this.idBrand=null;
    this.idCategory=null;
  }

  onItemChangeRating(value){
    console.log(value);
  }
}
