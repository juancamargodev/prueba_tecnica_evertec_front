import {Response} from "./response.interface";
import {Product} from "./products.interface";

export interface Order{
  id?:number,
  user_id?: number,
  status?: number,
  products?: Product[],
  created_at?: string,
  updated_at?: string
}

export interface OrdersResponse extends Response{
  data?: Order[]
}

export interface OrderResponse extends Response{
  data?: Order
}
