import {Response} from './response.interface';

export interface StateOrderResponse extends Response{
  data: StateOrder
}

export interface StateOrder{
  requestId:    number;
  status:       Status;
  request:      Request;
  subscription: null;
}

export interface Request {
  locale:     string;
  payer:      Payer;
  payment:    Payment;
  fields:     Field[];
  returnUrl:  string;
  ipAddress:  string;
  userAgent:  string;
  expiration: Date;
}

export interface Field {
  keyword:   string;
  value:     string;
  displayOn: string;
}

export interface Payer {
  document:     string;
  documentType: string;
  name:         string;
  surname:      string;
  email:        string;
  mobile:       string;
}

export interface Payment {
  reference:    string;
  description:  string;
  amount:       Amount;
  allowPartial: boolean;
  subscribe:    boolean;
}

export interface Amount {
  currency: string;
  total:    number;
}

export interface Status {
  status:  string;
  reason:  string;
  message: string;
  date:    Date;
}
