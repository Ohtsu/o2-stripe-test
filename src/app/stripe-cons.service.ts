import { Injectable } from '@angular/core';

@Injectable()
export class StripeConsService {

  API_BASE :String;
  UPLOAD_BASE :String;
  CUSTOMERS :String;
  CHARGES :String;
  EVENTS :String;
  REFUNDS :String;
  TOKENS :String;
  PLANS :String;
  SUBSCRIPTIONS :String;
  ORDERS :String;
  SKUS :String;
  PRODUCTS :String;
  BALANCE :String;
  BALANCE_HISTORY :String;
  DISPUTES :String;
  TRANSFERS: String;
  ACCOUNTS: String;
  FILES: String;

  constructor() {
    this.API_BASE = "https://api.stripe.com/v1/";
    this.UPLOAD_BASE = "https://uploads.stripe.com/v1/";
    this.CUSTOMERS = this.API_BASE + "customers";
    this.CHARGES = this.API_BASE + "charges";
    this.EVENTS = this.API_BASE + "events";
    this.REFUNDS = this.API_BASE + "refunds";
    this.TOKENS = this.API_BASE + "tokens";
    this.PLANS = this.API_BASE + "plans";
    this.SUBSCRIPTIONS = this.API_BASE + "subscriptions";
    this.ORDERS = this.API_BASE + "orders";
    this.SKUS = this.API_BASE + "skus";
    this.PRODUCTS = this.API_BASE + "products";
    this.BALANCE = this.API_BASE + "balance";
    this.BALANCE_HISTORY = this.API_BASE + "balance/history";
    this.DISPUTES = this.API_BASE + "disputes";
    this.TRANSFERS = this.API_BASE + "transfers";
    this.ACCOUNTS = this.API_BASE + "accounts";
    this.FILES = this.UPLOAD_BASE + "files";
  }


}
