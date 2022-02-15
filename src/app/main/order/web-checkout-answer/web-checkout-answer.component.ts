import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EvertecBackendService} from "../../../services/evertec-backend.service";
import {StateOrder, StateOrderResponse} from "../../../interfaces/stateOrder.interface";

@Component({
  selector: 'app-web-checkout-answer',
  templateUrl: './web-checkout-answer.component.html',
  styleUrls: ['./web-checkout-answer.component.sass']
})
export class WebCheckoutAnswerComponent implements OnInit {

  public stateOrder!: StateOrder;
  public orderId: number;

  constructor(
    private evertecService: EvertecBackendService,
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) {
    this.orderId = this.activatedRouter.snapshot.params.orderId;
  }

  ngOnInit(): void {
    this.getStateOrder();
  }

  /**
   * @desc consulta el estado de la orden
   * @author Juan Pablo Camargo Vanegas
   * @return void
   */
  public getStateOrder():void{
    this.evertecService.stateOrder(this.orderId).subscribe(
      (resp:StateOrderResponse)=>{
      if(resp.success === true){
        this.stateOrder = resp.data;
      }
    },
      error => this.evertecService.showErrorAlert(error)
    );
  }

  /**
   * @desc redirige al listado de ordenes
   * @author Juan Pablo Camargo Vanegas
   * @return void
   */
  public showOrders():void{
    this.router.navigateByUrl('main/orders');
  }

  /**
   * @desc redirige al detalle de la orden
   * @author Juan Pablo Camargo Vanegas
   * @return void
   */
  public retryPayment():void{
    this.router.navigate(['main/orders/order', this.orderId]);
  }

}
