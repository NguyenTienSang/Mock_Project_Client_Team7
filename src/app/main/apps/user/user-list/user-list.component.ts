import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { UserListService } from 'app/main/apps/user/user-list/user-list.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserListComponent implements OnInit {
  // Public
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;

  public currentUser;

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {UserListService} _userListService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _userListService: UserListService,
    private _coreSidebarService: CoreSidebarService,
	private _toastrService: ToastrService,
    private _httpClient: HttpClient) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  //DeleteUser
  deleteUser(id: string): Promise<any[]> {
    if(confirm("Are you sure to delete?")){
      return new Promise((resolve, reject) => {
       this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
         const headers = new HttpHeaders({
           'Content-Type': 'application/json',
           'Authorization': `Bearer ` + this.currentUser.resultObj
         })
         this._httpClient.delete(`${environment.apiUrl}/api/User/delete` +'/' + id, { headers: headers }).subscribe(data => {
           window.location.reload();
         });
   });
    }
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
      return d.userName.toLowerCase().indexOf(val) !== -1 || d.email.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // Update The Rows
    this.rows = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    Swal.close();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this._userListService.onDatatablessChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.rows = response;
      this.tempData = this.rows;
    });
  }
}
