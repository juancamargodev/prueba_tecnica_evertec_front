import {Response} from "./response.interface";

export interface ProductsResponse extends Response{
  data?: Product[]
}

export interface WebCheckoutResponse extends Response{
  data?: {
    requestId: number,
    processUrl: string
  }
}

export interface Product{
  id?: number,
  name?: string,
  price?: number,
  image_url?: string,
  created_at?: string,
}

