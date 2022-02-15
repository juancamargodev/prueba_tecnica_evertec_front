import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DetailComponent} from "./detail/detail.component";
import {ListComponent} from "./list/list.component";
import {CurrentComponent} from "./current/current.component";
import {WebCheckoutAnswerComponent} from "./web-checkout-answer/web-checkout-answer.component";
import {ValidateTokenGuard} from "../../guards/validate-token.guard";

const routes: Routes = [
  {
    path:'',
    component:ListComponent,
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },
  {
    path:'order/:id',
    component:DetailComponent,
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },
  {
    path:'current',
    component:CurrentComponent,
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },
  {
    path:'webCheckoutAnswer/:orderId',
    component:WebCheckoutAnswerComponent,
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
