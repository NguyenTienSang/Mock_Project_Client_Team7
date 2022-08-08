import { Component, OnInit, ViewChild} from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2';
import { CategoryService } from '../category.service';
import { DatePipe } from '@angular/common';
import { FormsModule } from './../../../forms/forms.module';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-category-manager',
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.scss']
})
export class CategoryManagerComponent implements OnInit {
  refreshCategory=new BehaviorSubject<boolean>(true);

  public contentHeader: object;
  typeAction: any;
  closeResult: string;
  private tempData = [];
  public rows;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public categoryList;
  public searchText;

  public page = 1;
  public pageSize = 10;

  public categoryName;
  public categories;

  categoryId;

  datePipe: DatePipe = new DatePipe('en-US');
  currentDate = new Date();

  currentUser = JSON.parse(localStorage.getItem("currentUser")).user.userName;

  constructor(private _categoryService: CategoryService, private modalService:NgbModal) { }

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

  openCreate(content) {
    //If add contact then reset null dat
      this.categoryName = "";
      this.typeAction ="Add Category"
    // console.log('txt : ',type);
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openUpdate(content, item)
  {
    this.typeAction ="Update Category";
    this.categoryName=item.name;
    this.categoryId=item.id;
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

  AddCategory(){
    console.log("Category name", this.categoryName);
    let categoryForCreate= {
      name: this.categoryName,
      createdBy: this.currentUser,
      updatedBy: this.currentUser
    }

    console.log("Category created", categoryForCreate);
    this._categoryService.addCategory(categoryForCreate).subscribe((response =>{
      if(response.isSuccessed)
      {
        Swal.fire("Success",response.message,"success")
        this.modalService.dismissAll();
        this.GetAllCategory();
      }
      else
        Swal.fire("Error",response.message,"error")
    }))
  }

  UpdateCategory(){
    console.log("Category name", this.categoryName);
    let categoryForUpdate= {
      name: this.categoryName,
      updatedBy: this.currentUser
    }

    this._categoryService.updateCategory(this.categoryId,categoryForUpdate).subscribe(response=>{
      if(response.isSuccessed)
      {
        Swal.fire("Success",response.message,"success")
        this.modalService.dismissAll();
        this.GetAllCategory();
      }
      else
        Swal.fire("Error",response.message,"error")
    });
  }

  DeleteCategory(value){
    this._categoryService.deleteCategory(value).subscribe(response => {
      if(response.isSuccessed)
      {
        Swal.fire("Success",response.message,"success")
        this.modalService.dismissAll();
        this.GetAllCategory();
      }
      else
        Swal.fire("Error",response.message,"error")
    });
  }

  SetPageSize(value){
    this.pageSize=value;
    console.log(this.pageSize);
  }
  private GetAllCategory(){
    this._categoryService.getCategory().subscribe(reponse=>{
      this.categoryList= reponse.resultObj;
    })
  }

  ngOnInit(): void {
      console.log(this.categoryList);
      // this._categoryService._refreshCategory$.subscribe(()=>{
      //   this.GetAllCategory();
      // });
      this.GetAllCategory();

    this.contentHeader = {
      headerTitle: 'Category',
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
            name: 'Category',
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
