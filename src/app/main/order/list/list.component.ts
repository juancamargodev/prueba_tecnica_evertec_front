import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {EvertecBackendService} from "../../../services/evertec-backend.service";
import {ListTableInterface} from "../../../interfaces/listTable.interface";
import {Order, OrdersResponse} from "../../../interfaces/order.interface";


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements AfterViewInit {

  public displayedColumns: string[] = ['id', 'status', 'articles', 'accion'];
  public dataSource!: MatTableDataSource<ListTableInterface>;
  @ViewChild(MatPaginator) public paginator!: MatPaginator;

  constructor(
    private evertecService: EvertecBackendService,
    private router: Router
  ){}

  ngAfterViewInit(): void {
    this.getOrders();
  }

  /**
   * @desc redirige al listado de ordenes
   * @author Juan Pablo Camargo Vanegas
   * @return void
   */
  public getOrders(){
    this.evertecService.getOrdersByUser().pipe().subscribe(
      (resp: OrdersResponse) =>{
      if(resp.success === true){
        const data = resp.data!.map((data: Order) =>{
          return {
            id: data.id!,
            status: this.getStatusName(data.status!),
            articles: data.products!.length
          }
        });
        this.dataSource = new MatTableDataSource<ListTableInterface>(data);
        this.dataSource.paginator = this.paginator;
      }
    },
      error => {
        this.evertecService.showErrorAlert(error)
        this.router.navigateByUrl('main/products');
      }
    );
  }

  /**
   * @desc redirige al detalle de la orden
   * @author Juan Pablo Camargo Vanegas
   * @return void
   */
  public showDetails(id: number){
    this.router.navigateByUrl(`main/orders/order/${id}`);
  }

  /**
   * @desc obtiene el nombre del estado
   * @author Juan Pablo Camargo Vanegas
   * @return string
   */
  private getStatusName(status: number):string{
    const STATUS_VALUES = [
      'CREADO',
      'PAGADO',
      'RECHAZADO',
      'PENDIENTE'
    ]
    return STATUS_VALUES[status];
  }

}
