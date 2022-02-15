import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import {SharedModule} from "../../shared/shared.module";
import { CurrentComponent } from './current/current.component';
import { WebCheckoutAnswerComponent } from './web-checkout-answer/web-checkout-answer.component';


@NgModule({
  declarations: [
    ListComponent,
    DetailComponent,
    CurrentComponent,
    WebCheckoutAnswerComponent,
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    SharedModule
  ]
})
export class OrderModule { }
