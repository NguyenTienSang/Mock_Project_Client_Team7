import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { EcommerceShopComponent } from './main/apps/ecommerce/ecommerce-shop/ecommerce-shop.component';
import { OrderManagementComponent } from './main/apps/order-management/order-management.component';

const routes: Routes = [
  { path: '', redirectTo: 'apps/e-commerce/shop', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'heroes', component: HeroesComponent },
  { path: 'apps/e-commerce/shop', component: EcommerceShopComponent },
  { path: 'apps/order-management', component: OrderManagementComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
