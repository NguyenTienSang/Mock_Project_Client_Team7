import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NouisliderModule } from 'ng2-nouislider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SwiperConfigInterface, SwiperModule, SWIPER_CONFIG } from 'ngx-swiper-wrapper';

import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule } from '@core/components';
import { CoreTouchspinModule } from '@core/components/core-touchspin/core-touchspin.module';

import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import { EcommerceDetailsComponent } from 'app/main/apps/ecommerce/ecommerce-details/ecommerce-details.component';
import { EcommerceItemComponent } from 'app/main/apps/ecommerce/ecommerce-item/ecommerce-item.component';
import { EcommerceShopComponent } from 'app/main/apps/ecommerce/ecommerce-shop/ecommerce-shop.component';
import { EcommerceSidebarComponent } from 'app/main/apps/ecommerce/ecommerce-shop/sidebar/sidebar.component';
import { EcommerceWishlistComponent } from 'app/main/apps/ecommerce/ecommerce-wishlist/ecommerce-wishlist.component';
import { EcommerceCheckoutComponent } from 'app/main/apps/ecommerce/ecommerce-checkout/ecommerce-checkout.component';
import { EcommerceCheckoutItemComponent } from 'app/main/apps/ecommerce/ecommerce-checkout/ecommerce-checkout-item/ecommerce-checkout-item.component';
import { EcommerceManagerComponent } from './ecommerce-manager/ecommerce-manager.component';
import { EcommerceManagerService } from './ecommerce-manager/ecommerce-manager.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { EcommerceEditComponent } from './ecommerce-edit/ecommerce-edit.component';
import { EcommerceAddComponent } from './ecommerce-add/ecommerce-add.component';
import { EcommerceEditService } from './ecommerce-edit/ecommerce-edit.service';
import { EcommerceDeleteComponent } from './ecommerce-delete/ecommerce-delete.component';
import { EcommerceDeleteService } from './ecommerce-delete/ecommerce-delete.service';

import { AccountSettingsService } from 'app/main/pages/account-settings/account-settings.service';
import { AccountSettingsComponent } from 'app/main/pages/account-settings/account-settings.component';




const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  observer: true
};

// routing
const routes: Routes = [
  {
    path: 'shop',
    component: EcommerceShopComponent,
    resolve: {
      ecommerce: EcommerceService
    }
  },
  {
    path: 'details/:id',
    component: EcommerceDetailsComponent,
    resolve: {
      ecommerce: EcommerceService
    }
  },
  {
    path: 'wishlist',
    component: EcommerceWishlistComponent,
    resolve: {
      ecommerce: EcommerceService
    }
  },
  {
    path: 'add',
    component: EcommerceAddComponent,
    resolve: {
      ecommerce: EcommerceService
    }
  },
  {
    path: 'checkout',
    component: EcommerceCheckoutComponent,
    resolve: {
      ecommerce: EcommerceService
    }
  },
  {
    path: 'product-delete',
    component: EcommerceDeleteComponent,
    resolve: {
      ecommerce: EcommerceDeleteService ,EcommerceService
    }
  },
  {
    path: 'edit/:id',
    component: EcommerceEditComponent,
    resolve: {
      ues: EcommerceEditService //Warning
    }
  },
  // {
  //   path: 'manager',
  //   component: EcommerceManagerComponent,
  //   resolve: {
  //     ecommerce: EcommerceService
  //   }
  // },
  {
    path: 'manager',
    component: EcommerceManagerComponent,
    resolve: {
      uls: EcommerceManagerService,
      EcommerceService //Warning
    }
  },
  {
    path: 'details',
    redirectTo: '/apps/e-commerce/details/27' //Redirection
  },
  {
    path: 'edit',
    redirectTo: '/apps/e-commerce/edit/2' // Redirection
  }
];

@NgModule({
  declarations: [
    EcommerceShopComponent,
    EcommerceSidebarComponent,
    EcommerceDetailsComponent,
    EcommerceWishlistComponent,
    EcommerceCheckoutComponent,
    EcommerceItemComponent,
    EcommerceCheckoutItemComponent,
    EcommerceManagerComponent,
    EcommerceEditComponent,
    EcommerceAddComponent,
    EcommerceDeleteComponent
  ],
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
    NouisliderModule
  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    },
    EcommerceManagerService,
    EcommerceEditService,
    AccountSettingsService
  ]
})
export class EcommerceModule {}
