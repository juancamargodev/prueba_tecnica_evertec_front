import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {MatTable} from "@angular/material/table";
import {EvertecBackendService} from "../../../services/evertec-backend.service";
import Swal from "sweetalert2";
import {Product, WebCheckoutResponse} from "../../../interfaces/products.interface";
import {Order} from "../../../interfaces/order.interface";

@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.sass']
})
export class CurrentComponent implements OnInit {

  public currentOrder!: Order;
  public total: number = 0;
  public displayedColumns: string[] = ['image_url', 'name', 'price', 'actions'];
  @ViewChild(MatTable) table!: MatTable<Order>

  constructor(
    private evertecService: EvertecBackendService,
    private router: Router
  ) {
    this.currentOrder = this.evertecService.orderTemp;
  }

  ngOnInit(): void {
    this.validateCurrentOrder();
  }

  /**
   * @desc valida si la orden temporal cuenta con productos
   * @author Juan Pablo Camargo Vanegas
   * @return void
   */
  public validateCurrentOrder():void{
    let message: string
    if(this.currentOrder === {}){
      message = 'no se encontró una orden abierta';
      this.redirectEmptyData(message);
    }
    if(this.currentOrder.products!.length === 0){
      message = 'actualmente no cuenta con productos para generar la orden';
      this.redirectEmptyData(message);
    }
    this.getTotalCost(this.currentOrder.products!);
  }

  /**
   * @desc obtiene el valor total de los productos
   * @author Juan Pablo Camargo Vanegas
   * @return void
   */
  public getTotalCost(products: Product[]):void{
    this.total = 0;
    products.forEach( (product: Product) => {
      this.total += product.price!;
    });
  }

  /**
   * @desc consulta el servicio para crear la orden y los datos de inicio de sesión en el web checkout
   * @author Juan Pablo Camargo Vanegas
   * @return void
   */
  public createOrder(){
    this.evertecService.createOrder(this.currentOrder).subscribe(
      resp => {
      if(resp.success === true){
        const url = `${window.location.protocol}//${window.location.host}`;
        const jsonPayment = {
          user_id: this.currentOrder.user_id,
          order_id: resp.data!.id,
          total: this.total,
          description: `Order no. ${resp.data!.id}`,
          reference: `OP-TEST-${resp.data!.id}`,
          returnUrl: `${url}/main/orders/webCheckoutAnswer/${resp.data!.id}`
        };
        this.payOrder(jsonPayment);
      }
    },
      error => this.evertecService.showErrorAlert(error)
    );
  }

  /**
   * @desc consulta los datos de sesión del web checkout y redirige a la url
   * @author Juan Pablo Camargo Vanegas
   * @return void
   */
  public payOrder(data: any):void{
    this.evertecService.payOrder(data).subscribe(
      (resp: WebCheckoutResponse) =>{
      if(resp.success === true){
        localStorage.removeItem('orderTemp');
        this.router.navigateByUrl('/orders');
        window.location.href = (resp.data!.processUrl);
      }
    },
      error => this.evertecService.showErrorAlert(error)
    );
  }

  /**
   * @desc elimina el producto seleccionado de la orden temporal y actualiza la tabla
   * @author Juan Pablo Camargo Vanegas
   * @return void
   */
  public deleteProduct(id: number):void{
    this.evertecService.removeProductToOrder(id);
    this.currentOrder = this.evertecService.orderTemp;
    this.getTotalCost(this.currentOrder.products!);
    this.table.renderRows();
    this.validateCurrentOrder();
  }

  /**
   * @desc mustra el mensaje y redirige a la vista de productos
   * @author Juan Pablo Camargo Vanegas
   * @return void
   */
  private redirectEmptyData(message: string){
    Swal.fire({
      title: 'Info',
      text: message,
      icon: 'info',
      confirmButtonText: 'Aceptar',
    }).then(result =>{
      if(result.isConfirmed){
        this.router.navigateByUrl('/main/products');
      }
    });
  }

}
