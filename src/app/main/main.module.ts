import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import {SharedModule} from "../shared/shared.module";

import { NavComponent } from './nav/nav.component';
import { ProductsComponent } from './products/products.component';



@NgModule({
  declarations: [
    NavComponent,
    ProductsComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule
  ]
})
export class MainModule { }
