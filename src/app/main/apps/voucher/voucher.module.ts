import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NouisliderModule } from 'ng2-nouislider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SwiperConfigInterface, SwiperModule, SWIPER_CONFIG } from 'ngx-swiper-wrapper';

import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule } from '@core/components';
import { CoreTouchspinModule } from '@core/components/core-touchspin/core-touchspin.module';

import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


import { VoucherManagerComponent } from './voucher-manager/voucher-manager.component';
import { VoucherService } from './voucher.service';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  observer: true
};

const routes: Routes = [
  {
    path: 'manager',
    component: VoucherManagerComponent,
  }
];

@NgModule({
  declarations: [VoucherManagerComponent],
  imports: [
  CommonModule,
  RouterModule.forChild(routes),
  SwiperModule,
  FormsModule,
  CoreTouchspinModule,
  ContentHeaderModule,
  CoreSidebarModule,
  CoreCommonModule,
  NgbModule,
  NgSelectModule,
  Ng2FlatpickrModule,
  NgxDatatableModule,
  NouisliderModule,
  ReactiveFormsModule,
  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    },
    VoucherService
  ]
})
export class VoucherModule { }
