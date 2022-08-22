import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { KbModule } from './kb/kb.module';
import { BlogModule } from './blog/blog.module';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { ProfileModule } from './profile/profile.module';
import { PricingModule } from './pricing/pricing.module';
import { FaqModule } from 'app/main/pages/faq/faq.module';
import { AccountSettingsModule } from './account-settings/account-settings.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { UserOrderManagementComponent } from './user-order/user-order-management/user-order-management.component';
import { UserOrderManagementItemComponent } from './user-order/user-order-management-item/user-order-management-item.component';

import { UserContactComponent } from './user-contact/user-contact.component';
import { UserOrderDetailComponent } from './user-order/user-order-detail/user-order-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { UserOrderDetailService } from './user-order/user-order-detail/user-order-detail.service';
import { UserVoucherManagementComponent } from './user-voucher/user-voucher-management/user-voucher-management.component';

const routes: Routes = [
  {
    path: 'user-order-detail/:id',
    component: UserOrderDetailComponent,
    resolve: {
      ecommerce:UserOrderDetailService
    }
  }
]

@NgModule({
  declarations: [UserOrderManagementComponent, UserOrderManagementItemComponent, UserContactComponent, UserOrderDetailComponent, UserVoucherManagementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    ContentHeaderModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    AuthenticationModule,
    MiscellaneousModule,
    Ng2FlatpickrModule,
    PricingModule,
    BlogModule,
    ProfileModule,
    KbModule,
    FaqModule,
    AccountSettingsModule
  ],

  providers: [
    UserOrderManagementComponent,
    UserOrderManagementItemComponent
  ]
})
export class PagesModule {}
