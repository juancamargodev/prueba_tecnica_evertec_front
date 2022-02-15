import {Component, OnInit} from '@angular/core';
import {EvertecBackendService} from "../../services/evertec-backend.service";
import {Product, ProductsResponse} from "../../interfaces/products.interface";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.sass']
})
export class ProductsComponent implements OnInit {

  public products: Product[] = [];


  constructor(
    private evertecService: EvertecBackendService
  ){}

  ngOnInit(): void {
    this.getProducts();
  }

  /**
   * @desc Consulta el servicio para obtener el listado de productos
   * @author Juan Pablo Camargo Vanegas
   * @return void
   */
  public getProducts(){
    this.evertecService.getProducts()
      .subscribe(
        (resp: ProductsResponse ) => {
        if(resp.success === true){
          this.products = resp.data!;
        }
      },
        error => this.evertecService.showErrorAlert(error)
      )
  }

  /**
   * @desc emite al servicio que se ha agregado un producto
   * @author Juan Pablo Camargo Vanegas
   * @return void
   */
  public addProduct(product: Product){
    this.evertecService.addProductToOrder(product);
  }


}
