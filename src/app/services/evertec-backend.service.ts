import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, map, tap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {environment} from "../../environments/environment";
import Swal from "sweetalert2";
import {Login, LoginResponse, User} from "../interfaces/auth.interface";
import {
  Product,
  ProductsResponse,
  WebCheckoutResponse
} from "../interfaces/products.interface";
import {StateOrderResponse} from "../interfaces/stateOrder.interface";
import {Order, OrderResponse, OrdersResponse} from "../interfaces/order.interface";

@Injectable({
  providedIn: 'root'
})
export class EvertecBackendService {

  private URL = environment.backend_url;
  private _user!: User;
  private _orderTemp!: Order;
  @Output() public onProductInTempOrder: EventEmitter<Order> = new EventEmitter();


  constructor(
    private http: HttpClient
  ) {
    this._orderTemp = this.getOrderTempData();
  }


  public get user(){
    return {...this._user};
  }

  public get orderTemp(){
    return {...this._orderTemp};
  }

  /*---[sección login]---*/
  /**
   * @desc Consulta el api para iniciar la sesión
   * @author Juan Pablo Camargo Vanegas
   * @return Observable<boolean>
   */
  public login(data: Login){
    const url = `${this.URL}/auth/login`;
    return this.http.post<LoginResponse>(
      url,
      data
    )
      .pipe(
        tap( resp => {
          if(resp.success){
            localStorage.setItem('token',resp.data!.access_token);
            this._user = {
              user_id: resp.data!.user_id,
              email: resp.data!.email,
              user: resp.data!.user,
            }
          }
        }),
        map( resp => resp.success!),
        catchError(err => of(err.error.message))
      );
  }

  /**
   * @desc Consulta el api para autenticar el token
   * @author Juan Pablo Camargo Vanegas
   * @return Observable<boolean>
   */
  public validateToken(): Observable<boolean>{
    const url = `${this.URL}/auth/refresh`;
    const headers = new HttpHeaders()
      .set('Authorization',  "Bearer"+localStorage.getItem('token') || '');
    return this.http.get<LoginResponse>( url, {headers})
      .pipe(
        tap( resp =>{
          if(resp.success){
            localStorage.setItem('token',resp.data!.access_token);
            this._user = {
              user_id: resp.data!.user_id,
              email: resp.data!.email,
              user: resp.data!.user
            }
          }
        }),
        map( resp => resp.success!),
        catchError( err => {
          return of(false);
        })
      );
  }
  /*---[fin sección]---*/

  /*---[sección productos]---*/
  /**
   * @desc Obtiene todos los productos
   * @author Juan Pablo Camargo Vanegas
   * @return Observable<ProductsResponse>
   */
  public getProducts(){
    const url = `${this.URL}/products`;
    const headers = this.getTokenHeader();
    return this.http.get<ProductsResponse>(url,{headers});
  }
  /*---[fin sección]---*/

  /*---[sección ordenes]---*/
  /**
   * @desc Obtiene las ordenes según el usuario
   * @author Juan Pablo Camargo Vanegas
   * @returns Observable<OrdersResponse>
   */
  public getOrdersByUser(){
    const userId = this._user.user_id;
    const url = `${this.URL}/orders/user/${userId}`;
    const headers = this.getTokenHeader();
    return this.http.get<OrdersResponse>(url, {headers})
  }

  /**
   * @desc Obtiene la orden según su id
   * @author Juan Pablo Camargo Vanegas
   * @returns Observable<OrderResponse>
   */
  public getOrder(id:string){
    const url = `${this.URL}/orders/${id}`;
    const headers = this.getTokenHeader();
    return this.http.get<OrderResponse>(url, {headers});
  }

  /**
   * @desc Crea la orden
   * @author Juan Pablo Camargo Vanegas
   * @returns Observable<OrderResponse>
   */
  public createOrder(order: Order){
    const url = `${this.URL}/orders/create`;
    const headers = this.getTokenHeader();
    return this.http.post<OrderResponse>(url, order, {headers});
  }

  /**
   * @desc Agrega un producto a la orden temporal
   * @author Juan Pablo Camargo Vanegas
   * @returns void
   */
  public addProductToOrder(product: Product):void{
    let order: Order = {...this.getOrderTempData()};
    order.products!.push(product);
    localStorage.setItem('orderTemp', JSON.stringify(order));
    this._orderTemp = order;
    this.onProductInTempOrder.emit(order);
  }

  /**
   * @desc Elimina un producto de la orden temporal
   * @author Juan Pablo Camargo Vanegas
   * @returns void
   */
  public removeProductToOrder(productId: number):void{
    let order: Order = {...this.getOrderTempData()};
    const index = order.products!.findIndex((product: Product) => product.id === productId);
    order.products!.splice(index,1);
    localStorage.setItem('orderTemp', JSON.stringify(order));
    this._orderTemp = order;
    this.onProductInTempOrder.emit(order);
  }
  /*---[fin sección]---*/

  /*---[sección web checkout]---*/
  /**
   * @desc Crea la sesión el el web checkout para pagar la orden
   * @author Juan Pablo Camargo Vanegas
   * @returns Observable<WebCheckoutResponse>
   */
  public payOrder(data: any){
    const url = `${this.URL}/webCheckout/pay`;
    const headers = this.getTokenHeader();
    return this.http.post<WebCheckoutResponse>(url, data,{headers});
  }

  /**
   * @desc Consulta el estado de la orden en el web checkout
   * @author Juan Pablo Camargo Vanegas
   * @returns Observable<StateOrderResponse>
   */
  public stateOrder(orderId: number){
    const url = `${this.URL}/webCheckout/stateOrder`;
    const headers = this.getTokenHeader();
    return this.http.post<StateOrderResponse>(url, {
      order_id: orderId
    },{headers});
  }
  /*---[fin sección]---*/

  /*---[sección utils]---*/
  /**
   * @desc elimina la orden temporal
   * @author Juan Pablo Camargo Vanegas
   * @returns void
   */
  public emptyCar(){
    localStorage.removeItem('orderTemp');
  }

  /**
   * @desc mustra una alerta con los errores de la consulta
   * @author Juan Pablo Camargo Vanegas
   * @returns void
   */
  public showErrorAlert(error: HttpErrorResponse):void{
    Swal.fire('Info', error.error.message);
  }

  /**
   * @desc obtiene o genera los datos para la orden temporal
   * @author Juan Pablo Camargo Vanegas
   * @returns Order
   */
  private getOrderTempData():Order{
    let orderTemp: Order = {};
    let localOrder = localStorage.getItem('orderTemp');
    if(!localOrder){
      orderTemp.user_id = this.user.user_id;
      orderTemp.products = [];
    }else{
      orderTemp = JSON.parse(localOrder);
    }
    return orderTemp
  }

  /**
   * @desc obtiene la cabecera con el token para consultar el api
   * @author Juan Pablo Camargo Vanegas
   * @returns HttpHeaders
   */
  private getTokenHeader():HttpHeaders{
    const headers = new HttpHeaders()
      .set('Authorization',  "Bearer"+localStorage.getItem('token') || '');
    return headers
  }
  /*---[fin sección]---*/

}
