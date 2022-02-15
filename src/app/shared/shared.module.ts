import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";
import {LayoutModule} from "@angular/cdk/layout";
import {MaterialModule} from "./material.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    FlexLayoutModule,
    LayoutModule,
    MaterialModule,
    SweetAlert2Module
  ]
})
export class SharedModule { }
