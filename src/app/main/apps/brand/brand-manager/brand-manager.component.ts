import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2';
import { BrandService } from '../brand.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '../../category/category.service';

@Component({
  selector: 'app-brand-manager',
  templateUrl: './brand-manager.component.html',
  styleUrls: ['./brand-manager.component.scss']
})
export class BrandManagerComponent implements OnInit {
  public contentHeader: object;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public searchText;
  private tempData = [];

  public brandList;
  public categoryList;

  typeAction: any;
  closeResult: string;
  public brandName;

  public categoryId;
  public brandId;

  public rows;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  datePipe: DatePipe = new DatePipe('en-US');
  currentDate = new Date();

  currentUser = JSON.parse(localStorage.getItem("currentUser")).user.userName;

  constructor(private _brandService: BrandService, private modalService:NgbModal, private _categoryService: CategoryService) { }
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
  }

  openCreate(content){
    //If add contact then reset null dat
    this.brandName = "";
    this.typeAction ="Add brand"
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

  openUpdate(content, item)
  {
    this.typeAction ="Update Brand";
    this.brandName=item.name;
    this.categoryId=item.category.id;
    this.brandId=item.id;
    // console.log('txt : ',type);
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  AddBrand(){
    let brandForCreate= {
      name: this.brandName,
      createdBy: this.currentUser,
      updatedBy: this.currentUser,
      categoryId:this.categoryId
    }

    this._brandService.addBrand(brandForCreate).subscribe((response =>{
      if(response.isSuccessed)
      {
        Swal.fire("Success",response.message,"success")
        this.modalService.dismissAll();
        this.GetAllBrand();
      }
      else
        Swal.fire("Error",response.message,"error")
    }))
  }

  UpdateBrand(){
    let brandForUpdate= {
      name: this.brandName,
      updatedBy: this.currentUser,
      categoryId:this.categoryId
    }

    this._brandService.updateBrand(this.brandId,brandForUpdate).subscribe(response=>{
      if(response.isSuccessed)
      {
        Swal.fire("Success",response.message,"success")
        this.modalService.dismissAll();
        this.GetAllBrand();
      }
      else
        Swal.fire("Error",response.message,"error")
    });
  }

  DeleteBrand(value){
    this._brandService.deleteBrand(value).subscribe(response => {
      if(response.isSuccessed)
      {
        Swal.fire("Success",response.message,"success")
        this.modalService.dismissAll();
        this.GetAllBrand();
      }
      else
        Swal.fire("Error",response.message,"error")
    });
  }

  private GetAllBrand(){
    this._brandService.getBrand().subscribe(reponse=>{
      this.brandList= reponse.resultObj;
    })
  }

  ngOnInit(): void {
    this._categoryService.getCategory().subscribe(reponse=>{
      this.categoryList= reponse.resultObj;
    });

    this.GetAllBrand();

    this.contentHeader = {
      headerTitle: 'Brand',
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
            name: 'Brand',
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
