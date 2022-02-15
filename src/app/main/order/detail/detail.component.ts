import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EvertecBackendService} from "../../../services/evertec-backend.service";
import {Product, WebCheckoutResponse} from "../../../interfaces/products.interface";
import {StateOrder, StateOrderResponse} from "../../../interfaces/stateOrder.interface";
import {Order, OrderResponse} from "../../../interfaces/order.interface";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.sass']
})
export class DetailComponent implements OnInit {

  public total: number = 0;
  public id!: string;
  public order!: Order;
  public responseStateOrder!: StateOrder;
  public products!: Product[];
  public displayedColumns: string[] = ['image_url', 'name', 'price'];

  constructor(
    private evertecService: EvertecBackendService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.id = this.activeRoute.snapshot.params.id;
  }

  ngOnInit(): void {
    this.stateOrder();
  }

  /**
   * @desc consulta el estado de la orden y lo actualiza
   * @author Juan Pablo Camargo Vanegas
   * @return void
   */
  public stateOrder():void{
    const orderId = parseInt(this.id);
    this.evertecService.stateOrder(orderId).subscribe(
      (resp:StateOrderResponse) => {
        this.responseStateOrder = resp.data;
    },
      error => this.evertecService.showErrorAlert(error)
    );
    this.getOrderDetail();
  }

  /**
   * @desc obtiene el detalle de la orden
   * @author Juan Pablo Camargo Vanegas
   * @return void
   */
  public getOrderDetail():void{
    this.evertecService.getOrder(this.id).subscribe(
      (resp:OrderResponse) => {
      if(resp.success === true){
        this.order = resp.data!;
        this.products = this.order.products!;
        this.getTotalCost(this.products);
      }
    },
      error => this.evertecService.showErrorAlert(error)
    );
  }

  /**
   * @desc genera los datos de la sesión del web checkout y redirige a la url
   * @author Juan Pablo Camargo Vanegas
   * @return void
   */
  public payOrder():void{
    const url = `${window.location.protocol}//${window.location.host}`;
    const orderId = this.order.id;
    const jsonPayment = {
      user_id: this.order.user_id,
      order_id: orderId,
      total: this.total,
      description: `Order no. ${orderId}`,
      reference: `OP-TEST-${orderId}`,
      returnUrl: `${url}/main/orders/webCheckoutAnswer/${orderId}`
    };
    this.evertecService.payOrder(jsonPayment).subscribe(
      (resp:WebCheckoutResponse) =>{
      if(resp.success === true){
        this.router.navigateByUrl('/orders');
        window.location.href = (resp.data!.processUrl);
      }
    },
      error => this.evertecService.showErrorAlert(error)
    );
  }

  /**
   * @desc genera el total de los gastos y lo asigna a la variable
   * @author Juan Pablo Camargo Vanegas
   * @return void
   */
  public getTotalCost(products: Product[]):void{
    products.forEach( (product: Product) => {
      this.total += product.price!;
    });
  }

  /**
   * @desc obtiene el nombre del estado
   * @author Juan Pablo Camargo Vanegas
   * @return string
   */
  public getStatusName(status: number):string{
    const STATUS_VALUES = [
      'CREADO',
      'PAGADO',
      'RECHAZADO',
      'PENDIENTE'
    ]
    return STATUS_VALUES[status];
  }

  /**
   * @desc redirige al listado de ordenes
   * @author Juan Pablo Camargo Vanegas
   * @return void
   */
  public showLists():void{
    this.router.navigateByUrl('main/orders');
  }

}
