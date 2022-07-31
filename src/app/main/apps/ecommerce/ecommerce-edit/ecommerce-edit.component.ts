import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { EcommerceEditService } from './ecommerce-edit.service';
@Component({
  selector: 'app-ecommerce-edit',
  templateUrl: './ecommerce-edit.component.html',
  styleUrls: ['./ecommerce-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EcommerceEditComponent implements OnInit {
  public url = this.router.url;
  public urlLastValue;
  public rows;
  public contentHeader: object;

  public birthDateOptions: FlatpickrOptions = {
    altInput: true
  };

  public selectMultiLanguages = ['English', 'Spanish', 'French', 'Russian', 'German', 'Arabic', 'Sanskrit'];
  public selectMultiLanguagesSelected = [];

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(private router: Router, private _ecommerceEditService: EcommerceEditService, private _ecommerceService: EcommerceService) {
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
    });
  }

}
