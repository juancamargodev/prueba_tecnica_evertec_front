import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NavComponent} from "./nav/nav.component";
import {ProductsComponent} from "./products/products.component";
import {ValidateTokenGuard} from "../guards/validate-token.guard";

const routes: Routes = [
  {
    path:'',
    component:NavComponent,
    children:[
      {
        path:'products',
        component:ProductsComponent,
        canActivate: [ ValidateTokenGuard ],
        canLoad: [ ValidateTokenGuard ]
      },
      {
        path:'orders',
        loadChildren: () => import('./order/order.module').then(m => m.OrderModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
