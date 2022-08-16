import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { AccountSettingsComponent } from 'app/main/pages/account-settings/account-settings.component';
import { AccountSettingsService } from 'app/main/pages/account-settings/account-settings.service';

import { UserContactComponent } from '../user-contact/user-contact.component';

import { UserOrderManagementComponent } from '../user-order/user-order-management/user-order-management.component';
import { UserOrderDetailComponent } from '../user-order/user-order-detail/user-order-detail.component';

const routes: Routes = [
  {
    path: 'account-settings',
    component: AccountSettingsComponent,
    canActivate: [AuthGuard],
    resolve: {
      accountSetting: AccountSettingsService
    }
  },
  {
    path: 'user-order-manage',
    component: UserOrderManagementComponent,
    canActivate: [AuthGuard],
    // resolve: {
    //   accountSetting: AccountSettingsService
    // }
  },
  {
    path: 'user-order-detail/:id',
    component: UserOrderDetailComponent,
    canActivate: [AuthGuard],
    // resolve: {
    //   accountSetting: AccountSettingsService
    // }
  },
  {
    path: 'user-contact',
    component: UserContactComponent,
    canActivate: [AuthGuard],
    // resolve: {
    //   accountSetting: AccountSettingsService
    // }
  }
];

@NgModule({
  declarations: [AccountSettingsComponent],
  imports: [CommonModule, RouterModule.forChild(routes), NgbModule, CoreCommonModule, ContentHeaderModule],

  providers: [AccountSettingsService]
})
export class AccountSettingsModule {}
