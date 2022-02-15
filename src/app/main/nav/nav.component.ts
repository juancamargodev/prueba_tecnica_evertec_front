import {Component, OnInit} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {Router} from "@angular/router";
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {EvertecBackendService} from "../../services/evertec-backend.service";
import {Order} from "../../interfaces/order.interface";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit{

  public addedProducts: number = 0;
  public hideBadge: boolean = true;

  //observable para manejar el menú
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private evertecService: EvertecBackendService,
    private router: Router
  ) {
    this.evertecService.onProductInTempOrder.subscribe((resp: Order) =>{
      this.showOrderBadge();
    });
  }

  ngOnInit(): void {
    this.showOrderBadge();
  }

  get user(){
    return this.evertecService.user;
  }

  get order(){
    return this.evertecService.orderTemp;
  }

  /**
   * @desc cierra la sesión
   * @author Juan Pablo Camargo Vanegas
   * @return void
   */
  public logout():void{
    localStorage.clear();
    this.router.navigateByUrl('');
  }

  /**
   * @desc consulta el servicio para vaciar los articulos de la orden temporal
   * @author Juan Pablo Camargo Vanegas
   * @return void
   */
  public emptyCar():void{
    this.addedProducts = 0;
    this.hideBadge = true;
    this.evertecService.emptyCar();
  }

  /**
   * @desc muestra la cantidad de productos agregados en la orden temporal
   * @author Juan Pablo Camargo Vanegas
   * @return void
   */
  private showOrderBadge(){
    const order: Order = this.order;
    this.addedProducts = order.products!.length;
    if(this.addedProducts > 0){
      this.hideBadge = false;
    }
  }

}
