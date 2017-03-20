import { NgModule,Component } from '@angular/core';
import { Http, Headers,Response,RequestOptions,Request, RequestMethod } from "@angular/http";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { StripeConsService } from './stripe-cons.service';
import { StripeAuthService } from './stripe-auth.service';
declare var Stripe:any;
declare var StripeCheckout:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  localInputParams: any;
  localOutput: any;

  subscriptionId:any;
  subscriptionParam:any;
  subscriptionOutput:any;

  chargeId:any;
  chargeParam:any;
  chargeOutput:any;

  orderId:any;
  orderParam:any;
  orderOutput:any;

  accountId:any;
  accountParam:any;
  accountOutput:any;

  customerId:any;
  customerParam:any;
  customerOutput:any;

  tokenId:any;
  tokenParam:any;
  tokenOutput:any;

  refundId:any;
  refundParam:any;
  refundOutput:any;

  planId:any;
  planParam:any;
  planOutput:any;

  productId:any;
  productParam:any;
  productOutput:any;
  productDuplicatedParamName: any;
  productDuplicatedParams: any;

  skuId:any;
  skuParam:any;
  skuOutput:any;

  eventId:any;
  eventParam:any;
  eventOutput:any;

  disputeId:any;
  disputeParam:any;
  disputeOutput:any;

  balanceId:any;
  balanceParam:any;
  balanceOutput:any;

  transferId:any;
  transferParam:any;
  transferOutput:any;

  fileUploadId:any;
  fileUploadParam:any;
  fileUploadOutput:any;


  cardToken: any;
  
  _http: any;
  private _auth:any;
  public _stripeTestSecretKey:any;
  public _stripeTestPublicKey:any;


  constructor(http: Http,private _stripe:StripeConsService,private _stripeAuth:StripeAuthService){
    this._http = http;
    this._auth = _stripeAuth;
  }

  ngOnInit(){
    this._stripeTestSecretKey = this._auth.getTestSecretKey();
    this._stripeTestPublicKey = this._auth.getTestPublicKey();
    this.setUpClientCard();

  }


// Client Side functions -----------------------

  localCheckout(token){
    console.log("local checkout token----",token);
    let dataObj = {"key": this._stripeTestPublicKey, "locale": "auto", "token": token};
    let _checkout = StripeCheckout.configure(dataObj);
    let product = {"name": "T-shirt",
                    "description": "Test buy sample",
                    "email": "customer05@example.com",
                    "amount": "8000"};
    _checkout.open(product);   
  }

  async serverRegisterCustomer(token){
    if (this.localInputParams == null){
      this.localOutput = "No Input Data";
      return;
    }
    try{
      let udata = JSON.parse(this.localInputParams);
      udata["source"]=token;
      let res = await this.createCustomer(udata);
      this.localOutput = JSON.stringify(res);
    }
    catch(e){
      this.localOutput = JSON.stringify(e);
    }
    // let udata = JSON.parse(this.localInputParams);
    // udata["source"]=token;
    // console.log(udata);
    // let res = await this.createCustomer(udata);
    // this.localOutput = JSON.stringify(res);
    // console.log(res);

  }


  setUpClientCard() {
    Stripe.setPublishableKey(this._stripeTestPublicKey);
  }

  getClientCardData(number, month, year, cvc) {
    this.getClientCardToken(number, month, year, cvc);
    // console.log("cardToken-----------",this.cardToken);
  }

  getClientCardToken(number, month, year, cvc) {
    var dataObj = {"number": number, "exp_month": month, "exp_year": year, "cvc": cvc};

    Stripe.card.createToken(dataObj,
      (status, response) => { 
        if (status === 200) {
          console.log("the card response: ", response);
          this.cardToken = response.id;
          // this.localCheckout(this.cardToken);
          this.serverRegisterCustomer(this.cardToken);
          console.log("the card token: ", response.id);
          console.log("the card id: ", response.card.id);
          console.log("the card brand: ", response.card.brand);
          console.log("the card country: ", response.card.country);
        }
        else {
          console.log("error in getting card data: ", response.error)
        }
      }
    );

  }

    onBtnBrowseClick(event:any){
         let uploadButton = document.getElementById("btnUpload");
         uploadButton.click();
     }

    async onBtnUploadChange(event:any){
         let targetFile = event.srcElement.files[0];
         let uploader = document.getElementById("btnUpload");
         console.log("targetFile------------",targetFile);
         let res = await this.sendFile(this._stripe.FILES, targetFile,"dispute_evidence");
         console.log("upload res-----",res);
        //  let fbsPath = this.fbsBasePath + targetFile.name;
        //  this.uploadFile(fbsPath,targetFile);
     }



// test functions =========================

// test Common Functions

  async tstCreateCommon(command,params,sameName?,array?){
    if (params == null){
      return "No param Data";
    }
    try {
      let pm = JSON.parse(params);
      let res = await this.createCommon(command,pm,sameName,array);
      return JSON.stringify(res);
    }
    catch(e){
      return  JSON.stringify(e);
    }
  }

  async tstRetrieveBalanceCommon(command){
    try {
      let res = await this.retrieveCommon(command);
      return JSON.stringify(res);
    }
    catch(e){
      return JSON.stringify(e);
    }

  }

  async tstRetrieveCommon(command,id){
    if (id == null){
      return "No Id";
    }
    try {
      let res = await this.retrieveCommon(command,id);
      return JSON.stringify(res);
    }
    catch(e){
      return JSON.stringify(e);
    }

  }

  async tstUpdateCommon(command,id,params){
    if (id == null){
      return "No Id";
    }
    if (params == null){
      return "No param Data";
    }
    try {
      let res = await this.updateCommon(command,id,JSON.parse(params));
      return JSON.stringify(res);
    }
    catch(e){
      return JSON.stringify(e);
    }
    
  }

  async tstDeleteCommon(command,id){
    if (id == null){
      return "No Id";
    }
    try {
      let res = await this.deleteCommon(command,id);
      return JSON.stringify(res);
    }
    catch(e){
      return JSON.stringify(e);
    }
  }

  async tstRejectCommon(command,id){
    if (id == null){
      return "No Id";
    }
    try {
      let res = await this.rejectCommon(command,id);
      return JSON.stringify(res);
    }
    catch(e){
      return JSON.stringify(e);
    }
  }

    // async _rejectAccount(){
  //   let id = "acct_19wT1PEIQsYRQY1x";
  //   try {
  //     let res = await this.rejectCommon(this._stripe.ACCOUNTS,id);
  //     console.log("test Ok   -----",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }


  async tstListCommon(command,params){
    let pm: any; 
    if (params == null){
      pm =  {"limit": 3};
    }
    else {
      pm = JSON.parse(params);
    }
    try {
      let res = await this.listCommon(command,pm);
      return JSON.stringify(res);
    }
    catch(e){
      return JSON.stringify(e);
    }
    
  } 

  async tstCaptureCommon(command,id,params){
    try {
      let res = await this.captureCommon(command,id,JSON.parse(params));
      return JSON.stringify(res);
    }
    catch(e){
      return JSON.stringify(e);
    }
  }

  async tstPayCommon(command,id,params){
    if (id == null){
      return "No Id";
    }
    if (params == null){
      return "No param Data";
    }
    try {
      let res = await this.payCommon(command,id,JSON.parse(params));
      return JSON.stringify(res);
    }
    catch(e){
      return JSON.stringify(e);
    }
  }

  async tstCloseCommon(command,id){
    if (id == null){
      return "No Id";
    }
    try {
      let res = await this.closeCommon(command,id);
      return JSON.stringify(res);
    }
    catch(e){
      return JSON.stringify(e);
    }
  }


// __ Test Dispute ____


  async _retrieveDispute(){
    this.disputeOutput = await this.tstRetrieveCommon(this._stripe.DISPUTES,this.disputeId); 
  }


  async _updateDispute(){
    this.disputeOutput = await this.tstUpdateCommon(this._stripe.DISPUTES,this.disputeId,this.disputeParam); 
  }


  async _closeDispute(){
    this.disputeOutput = await this.tstCloseCommon(this._stripe.DISPUTES,this.disputeId); 
  }


  async _listDisputes(){
    this.disputeOutput = await this.tstListCommon(this._stripe.DISPUTES,this.disputeParam); 
  }



  // async _retrieveDispute(){
  //   let id = "dp_19wOs9GhaJuqPLqdm5ECAF4C";
  //   try {
  //     let res = await this.retrieveCommon(this._stripe.DISPUTES,id);
  //     console.log("test Ok   -----",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }

  // async _updateDispute(){
  //   let id = "dp_19wOs9GhaJuqPLqdm5ECAF4C";
  //   let params = {
  //                   "evidence[customer_name]": "Lily White",
  //                   "evidence[product_description]": "Comfortable cotton t-shirt",
  //                   // "evidence[shipping_documentation]": "file_19w16tGhaJuqPLqdhMEZLLj5",
  //                 };
  //   try {
  //     let res = await this.updateCommon(this._stripe.DISPUTES,id,params);
  //     console.log("test Ok   -----",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }

  // async _closeDispute(){
  //   let id = "dp_19wOs9GhaJuqPLqdm5ECAF4C";
  //   try {
  //     let res = await this.closeCommon(this._stripe.DISPUTES,id);
  //     console.log("test Ok   -----",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }



  // async _listDisputes(){
  //   let params = {"limit": 5};
  //   try {
  //     let res = await this.listCommon(this._stripe.DISPUTES,params);
  //     console.log("res---",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }


// __ Test Balance ____


  async _retrieveBalance(){
    this.balanceOutput = await this.tstRetrieveBalanceCommon(this._stripe.BALANCE); 
  }


  async _retrieveBalanceTransaction(){
    this.balanceOutput = await this.tstRetrieveCommon(this._stripe.BALANCE_HISTORY,this.balanceId); 
  }


  async _listBalanceHistory(){
    this.balanceOutput = await this.tstListCommon(this._stripe.BALANCE_HISTORY,this.balanceParam); 
  }



  // async _retrieveBalance(){
  //   try {
  //     let res = await this.retrieveCommon(this._stripe.BALANCE);
  //     console.log("test Ok   -----",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }

  // async _retrieveBalanceTransaction(){
  //   let id = "txn_19wMbYGhaJuqPLqdxvlMz5or";
  //   try {
  //     let res = await this.retrieveCommon(this._stripe.BALANCE_HISTORY,id);
  //     console.log("test Ok   -----",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }

  // async _listBalanceHistory(){
  //   let params = {"limit": 5};
  //   try {
  //     let res = await this.listCommon(this._stripe.BALANCE_HISTORY,params);
  //     console.log("res---",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }

// __ Test Customer ____

  async _createCustomer(){
    this.customerOutput = await this.tstCreateCommon(this._stripe.CUSTOMERS,this.customerParam); 
  }


  async _retrieveCustomer(){
    this.customerOutput = await this.tstRetrieveCommon(this._stripe.CUSTOMERS,this.customerId); 
  }


  async _updateCustomer(){
    this.customerOutput = await this.tstUpdateCommon(this._stripe.CUSTOMERS,this.customerId,this.customerParam); 
  }


  async _deleteCustomer(){
    this.customerOutput = await this.tstDeleteCommon(this._stripe.CUSTOMERS,this.customerId); 
  }


  async _listCustomers(){
    this.customerOutput = await this.tstListCommon(this._stripe.CUSTOMERS,this.customerParam); 
  }


  // _createCustomer(){
  //   let userData = {"email": "customer03@example.com",
  //                   "description": "user03",
  //                   "source": "tok_19uvM9GhaJuqPLqdo57PENTu"};
  //   let res = this.createCustomer(userData);
  //   console.log(res);
  // }

  // _retrieveCustomer(){
  //   let customerId = "cus_AFQHOHD8VwGaEa";
  //   let res = this.retrieveCustomer(customerId);
  // }


  // _updateCustomer(){
  //   let customerId = "cus_AFQHOHD8VwGaEa";
  //   let params = {"description": "This is for user03"};
  //   let res = this.updateCustomer(customerId,params);
  //   console.log(res);
  // }

  // _deleteCustomer(){
  //   let customerId = "cus_AFQWStffA2j1QR";
  //   let res = this.deleteCustomer(customerId);
  // }

  // _listCustomers(){
  //   let params = {"limit": 5};
  //   let res = this.listCustomers(params);
  //   console.log(res);
  // }

// __ Test Plan ____

  async _createPlan(){
    this.planOutput = await this.tstCreateCommon(this._stripe.PLANS,this.planParam); 
  }


  async _retrievePlan(){
    this.planOutput = await this.tstRetrieveCommon(this._stripe.PLANS,this.planId); 
  }


  async _updatePlan(){
    this.planOutput = await this.tstUpdateCommon(this._stripe.PLANS,this.planId,this.planParam); 
  }


  async _deletePlan(){
    this.planOutput = await this.tstDeleteCommon(this._stripe.PLANS,this.planId); 
  }


  async _listPlans(){
    this.planOutput = await this.tstListCommon(this._stripe.PLANS,this.planParam); 
  }


  // async _createPlan(){
  //   let params = {
  //     "amount": 3000,
  //     "interval": 'month',
  //     "name": 'Silver',
  //     "currency": 'jpy',
  //     "id": 'gold-silver'
  //   };
  //   let res = await this.createPlan(params);
  //   console.log(res);
  // }

  // async _updatePlan(){
  //   let id = "gold-unlimited";
  //   let params = {"name": "Ruby performance02"};
  //   let res = await this.updatePlan(id,params);
  //   console.log(res);
  // }

  // async _deletePlan(){
  //   let id = "gold-silver";
  //   let res = await this.deletePlan(id);
  //   console.log(res);
  // }

  // async _listPlans(){
  //   let params = {"limit": 5};
  //   let res = await this.listPlans(params);
  //   console.log(res);
  // }

  // async _retrievePlan(){
  //   let id = "gold-unlimited";
  //   try {
  //     let res = await this.retrievePlan(id);
  //     console.log("test Ok   -----",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }



// __ Test Charge ____

  async _createCharge(){
    this.chargeOutput = await this.tstCreateCommon(this._stripe.CHARGES,this.chargeParam); 
  }


  async _retrieveCharge(){
    this.chargeOutput = await this.tstRetrieveCommon(this._stripe.CHARGES,this.chargeId); 
  }


  async _updateCharge(){
    this.chargeOutput = await this.tstUpdateCommon(this._stripe.CHARGES,this.chargeId,this.chargeParam); 
  }


  async _listCharges(){
    this.chargeOutput = await this.tstListCommon(this._stripe.CHARGES,this.chargeParam); 
  }



  async _captureCharge(){
    this.chargeOutput = await this.tstCaptureCommon(this._stripe.CHARGES,this.chargeId,this.chargeParam); 
  }


  // async _listCharges(){
  //   let params = {"limit": 5};
  //   let res = await this.listCharges(params);
  //   console.log(res);
  // }


// __ Test Subscription ____

  async _createSubscription(){
    this.subscriptionOutput = await this.tstCreateCommon(this._stripe.SUBSCRIPTIONS,this.subscriptionParam); 
  }


  async _retrieveSubscription(){
    this.subscriptionOutput = await this.tstRetrieveCommon(this._stripe.SUBSCRIPTIONS,this.subscriptionId); 
  }


  async _updateSubscription(){
    this.subscriptionOutput = await this.tstUpdateCommon(this._stripe.SUBSCRIPTIONS,this.subscriptionId,this.subscriptionParam); 
  }


  async _cancelSubscription(){
    this.subscriptionOutput = await this.tstDeleteCommon(this._stripe.SUBSCRIPTIONS,this.subscriptionId); 
  }


  async _listSubscriptions(){
    this.subscriptionOutput = await this.tstListCommon(this._stripe.SUBSCRIPTIONS,this.subscriptionParam); 
  }



// __ Test Order ____


  async _createOrder(){
    this.orderOutput = await this.tstCreateCommon(this._stripe.ORDERS,this.orderParam); 
  }


  async _retrieveOrder(){
    this.orderOutput = await this.tstRetrieveCommon(this._stripe.ORDERS,this.orderId); 
  }


  async _updateOrder(){
    this.orderOutput = await this.tstUpdateCommon(this._stripe.ORDERS,this.orderId,this.orderParam); 
  }


  async _payOrder(){
    this.orderOutput = await this.tstPayCommon(this._stripe.ORDERS,this.orderId,this.orderParam); 
  }


  async _listOrders(){
    this.orderOutput = await this.tstListCommon(this._stripe.ORDERS,this.orderParam); 
  }


  // async _createOrder(){
  //   let params = {
  //     "items[][type]": "sku",
  //     "items[][parent]": "sku_AGvaYehC5QHDHK",
  //     "currency": "jpy",
  //     "shipping[name]": "Zoey Wilson",
  //     "shipping[address][line1]": "1234 Main Street",
  //     "shipping[address][city]": "San Francisco",
  //     "shipping[address][state]": "CA",
  //     "shipping[address][country]": "US",
  //     "shipping[address][postal_code]": "94111",
  //     "email": "zoey.wilson@example.com",
  //   };

  //   try {
  //     let res = await this.createCommon(this._stripe.ORDERS,params);
  //     console.log("test Ok   -----",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }


  // async _retrieveOrder(){
  //   let id = "or_19wNkhGhaJuqPLqddCgjwDyw";
  //   try {
  //     let res = await this.retrieveCommon(this._stripe.ORDERS,id);
  //     console.log("test Ok   -----",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }

  // async _updateOrder(){
  //   let id = "or_19wNkhGhaJuqPLqddCgjwDyw";
  //   let params = {"metadata[order_id]": "006735700"};
  //   try {
  //     let res = await this.updateCommon(this._stripe.ORDERS,id,params);
  //     console.log("test Ok ---",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }

  // async _deleteOrder(){
  //   let id = "or_19wNkhGhaJuqPLqddCgjwDyw";
  //   try {
  //     let res = await this.deleteCommon(this._stripe.ORDERS,id);
  //     console.log("test Ok   -----",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }

  // async _listOrders(){
  //   let params = {"limit": 5};
  //   try {
  //     let res = await this.listCommon(this._stripe.ORDERS,params);
  //     console.log("res---",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }







// __ Test Account ____

  async _createAccount(){
    this.accountOutput = await this.tstCreateCommon(this._stripe.ACCOUNTS,this.accountParam); 
  }


  async _retrieveAccount(){
    this.accountOutput = await this.tstRetrieveCommon(this._stripe.ACCOUNTS,this.accountId); 
  }


  async _updateAccount(){
    this.accountOutput = await this.tstUpdateCommon(this._stripe.ACCOUNTS,this.accountId,this.accountParam); 
  }


  async _deleteAccount(){
    this.accountOutput = await this.tstDeleteCommon(this._stripe.ACCOUNTS,this.accountId); 
  }

  async _rejectAccount(){
    this.accountOutput = await this.tstRejectCommon(this._stripe.ACCOUNTS,this.accountId); 
  }


  async _listAccounts(){
    this.accountOutput = await this.tstListCommon(this._stripe.ACCOUNTS,this.accountParam); 
  }




  // async _createAccount(){
  //   let params = {
  //     "managed": "false",
  //     "country": "US",
  //     "email": "ohtsu@example.com",
  //   };
  //   try {
  //     let res = await this.createCommon(this._stripe.ACCOUNTS,params);
  //     console.log("test Ok   -----",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }


  // async _retrieveAccount(){
  //   let id = "acct_19wT1PEIQsYRQY1x";
  //   try {
  //     let res = await this.retrieveCommon(this._stripe.ACCOUNTS,id);
  //     console.log("test Ok   -----",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }

  // async _updateAccount(){
  //   let id = "acct_19wT1PEIQsYRQY1x";
  //   let params = {"support_phone": "555-867-5309"};
  //   try {
  //     let res = await this.updateCommon(this._stripe.ACCOUNTS,id,params);
  //     console.log("test Ok ---",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }

  // async _deleteAccount(){
  //   let id = "acct_19wT1PEIQsYRQY1x";
  //   try {
  //     let res = await this.deleteCommon(this._stripe.ACCOUNTS,id);
  //     console.log("test Ok   -----",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }

  // async _rejectAccount(){
  //   let id = "acct_19wT1PEIQsYRQY1x";
  //   try {
  //     let res = await this.rejectCommon(this._stripe.ACCOUNTS,id);
  //     console.log("test Ok   -----",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }

  // async _listAccounts(){
  //   let params = {"limit": 5};
  //   try {
  //     let res = await this.listCommon(this._stripe.ACCOUNTS,params);
  //     console.log("res---",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }

// __ Test Transfer ____

  async _createTransfer(){
    this.transferOutput = await this.tstCreateCommon(this._stripe.TRANSFERS,this.transferParam); 
  }


  async _retrieveTransfer(){
    this.transferOutput = await this.tstRetrieveCommon(this._stripe.TRANSFERS,this.transferId); 
  }


  async _updateTransfer(){
    this.transferOutput = await this.tstUpdateCommon(this._stripe.TRANSFERS,this.transferId,this.transferParam); 
  }


  async _listTransfers(){
    this.transferOutput = await this.tstListCommon(this._stripe.TRANSFERS,this.transferParam); 
  }



  // async _createTransfer(){
  //   let params = {
  //     "amount": "400",
  //     "currency": "jpy",
  //     "destination": "acct_19wT1PEIQsYRQY1x",
  //     "description": "Transfer to ohtsu@example.com",
  //   };
  //   try {
  //     let res = await this.createCommon(this._stripe.TRANSFERS,params);
  //     console.log("test Ok   -----",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }


  // async _retrieveTransfer(){
  //   let id = "acct_19wT1PEIQsYRQY1x";
  //   try {
  //     let res = await this.retrieveCommon(this._stripe.TRANSFERS,id);
  //     console.log("test Ok   -----",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }

  // async _updateTransfer(){
  //   let id = "acct_19wT1PEIQsYRQY1x";
  //   let params = {"support_phone": "555-867-5309"};
  //   try {
  //     let res = await this.updateCommon(this._stripe.TRANSFERS,id,params);
  //     console.log("test Ok ---",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }


  // async _listTransfers(){
  //   let params = {"limit": 5};
  //   try {
  //     let res = await this.listCommon(this._stripe.TRANSFERS,params);
  //     console.log("res---",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }





// __ Test Sku ____
  
  async _createSku(){
    this.skuOutput = await this.tstCreateCommon(this._stripe.SKUS,this.skuParam); 
  }


  async _retrieveSku(){
    this.skuOutput = await this.tstRetrieveCommon(this._stripe.SKUS,this.skuId); 
  }


  async _updateSku(){
    this.skuOutput = await this.tstUpdateCommon(this._stripe.SKUS,this.skuId,this.skuParam); 
  }


  async _deleteSku(){
    this.skuOutput = await this.tstDeleteCommon(this._stripe.SKUS,this.skuId); 
  }


  async _listSkus(){
    this.skuOutput = await this.tstListCommon(this._stripe.SKUS,this.skuParam); 
  }
  
  // async _createSku(){
  //   let params = {
  //     "attributes[size]": "Medium",
  //     "attributes[gender]": "Unisex",
  //     "price": "1500",
  //     "currency": "jpy",
  //     "inventory[type]": "finite",
  //     "inventory[quantity]": "500",
  //     "product": "prod_AGvJ9sQWjUIJll",
  //   };
  // //   try {
  //     let res = await this.createCommon(this._stripe.SKUS,params);
  //     console.log("test Ok   -----",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }


  // async _retrieveSku(){
  //   let id = "sku_AGvaYehC5QHDHK";
  //   try {
  //     let res = await this.retrieveCommon(this._stripe.SKUS,id);
  //     console.log("test Ok   -----",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }

  // async _updateSku(){
  //   let id = "sku_AGvaYehC5QHDHK";
  //   let params = {"metadata[order_id]": "6735700"};
  //   try {
  //     let res = await this.updateCommon(this._stripe.SKUS,id,params);
  //     console.log("test Ok ---",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }

  // async _deleteSku(){
  //   let id = "sku_AGvaYehC5QHDHK";
  //   try {
  //     let res = await this.deleteCommon(this._stripe.SKUS,id);
  //     console.log("test Ok   -----",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }

  // async _listSkus(){
  //   let params = {"limit": 5};
  //   try {
  //     let res = await this.listCommon(this._stripe.SKUS,params);
  //     console.log("res---",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }



// __ Test Product ____


  async _createProduct(){
    let parArray = this.productDuplicatedParams.split(',');
    this.productOutput = await this.tstCreateCommon(
                                              this._stripe.PRODUCTS,
                                              this.productParam,
                                              this.productDuplicatedParamName,
                                              parArray); 
  }


  async _retrieveProduct(){
    this.productOutput = await this.tstRetrieveCommon(this._stripe.PRODUCTS,this.productId); 
  }


  async _updateProduct(){
    this.productOutput = await this.tstUpdateCommon(this._stripe.PRODUCTS,this.productId,this.productParam); 
  }


  async _deleteProduct(){
    this.productOutput = await this.tstDeleteCommon(this._stripe.PRODUCTS,this.productId); 
  }


  async _listProducts(){
    this.productOutput = await this.tstListCommon(this._stripe.PRODUCTS,this.productParam); 
  }



  // async _createProduct(){
  //   let params = {
  //     "name": "T-shirt",
  //     "description": "Comfortable cotton t-shirt",
  //   };
  //   // let urlEncodedStr = this.addSameNameParams(params,"attributes[]",["size","gender"]);
  //   try {
  //     let res = await this.createCommon(this._stripe.PRODUCTS,params,"attributes[]",["size","gender"]);
  //     console.log("test Ok   -----",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }

  // async _retrieveProduct(){
  //   let id = "prod_AGe3cnZmmtTtkv";
  //   try {
  //     let res = await this.retrieveProduct(id);
  //     console.log("test Ok   -----",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }

  // async _updateProduct(){
  //   let id = "prod_AGe3cnZmmtTtkv";
  //   let params = {"description": "6735"};
  //   try {
  //     let res = await this.updateProduct(id,params);
  //     console.log("test Ok ---",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }

  // async _deleteProduct(){
  //   let id = "prod_AGe3cnZmmtTtkv";
  //   try {
  //     let res = await this.deleteProduct(id);
  //     console.log("test Ok   -----",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }

  // async _listProducts(){
  //   let params = {"limit": 5};
  //   try {
  //     let res = await this.listProducts(params);
  //     console.log("res---",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }


// __ Test Event ____

  async _retrieveEvent(){
    this.eventOutput = await this.tstRetrieveCommon(this._stripe.EVENTS,this.eventId); 
  }



  async _listEvents(){
    this.eventOutput = await this.tstListCommon(this._stripe.EVENTS,this.eventParam); 
  }

  // async _listEvents(){
  //   let params = {"limit": 5};
  //   try{
  //     let res = await this.listCommon(this._stripe.EVENTS,params);
  //     console.log(res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }

  // async _retrieveEvent(){
  //   let id = "evt_19wNtHGhaJuqPLqdBpjDJDKT";
  //   try {
  //     let res = await this.retrieveCommon(this._stripe.EVENTS,id);
  //     console.log("test Ok   -----",res);
  //   }
  //   catch(e){
  //     console.log("test error-----",e);
  //   }
  // }



// __ Test Refund ____


  async _createRefund(){
    this.refundOutput = await this.tstCreateCommon(this._stripe.REFUNDS,this.refundParam); 
  }


  async _retrieveRefund(){
    this.refundOutput = await this.tstRetrieveCommon(this._stripe.REFUNDS,this.refundId); 
  }


  async _updateRefund(){
    this.refundOutput = await this.tstUpdateCommon(this._stripe.REFUNDS,this.refundId,this.refundParam); 
  }


  async _listRefunds(){
    this.refundOutput = await this.tstListCommon(this._stripe.REFUNDS,this.refundParam); 
  }

  // _createRefund(){
  //   let params = {"charge": "ch_19vGSnGhaJuqPLqdJvC0aZkf" };
    
  //   return this.createCommon(this._stripe.REFUNDS,params);
  // }

  // _retrieveRefund(){
  //   let id = "re_19vIjbGhaJuqPLqdZUAz9Wpj";
  //   let res = this.retrieveRefund(id);
  // }

  // _updateRefund(){
  //   let params = {"reason": "requested_by_customer" };
  //   let id = "re_19vIjbGhaJuqPLqdZUAz9Wpj";
  //   let res = this.updateRefund(id,params);
  // }

  // _listRefunds(){
  //   let params = {"limit": 5};
  //   let res = this.listRefunds(params);
  //   console.log(res);
  // }


// __ Test Token ____

  async _createCardToken(){
    this.tokenOutput = await this.tstCreateCommon(this._stripe.TOKENS,this.tokenParam); 
  }

  async _createBankAccountToken(){
    this.tokenOutput = await this.tstCreateCommon(this._stripe.TOKENS,this.tokenParam); 
  }
  async _createPIIToken(){
    this.tokenOutput = await this.tstCreateCommon(this._stripe.TOKENS,this.tokenParam); 
  }

  async _retrieveToken(){
    this.tokenOutput = await this.tstRetrieveCommon(this._stripe.TOKENS,this.tokenId); 
  }

// Test File Uploads ____

  async _createFileUpload(){
    this.fileUploadOutput = await this.tstCreateCommon(this._stripe.FILES,this.fileUploadParam); 
  }


  async _retrieveFileUpload(){
    this.fileUploadOutput = await this.tstRetrieveCommon(this._stripe.FILES,this.fileUploadId); 
  }


  async _listFileUploads(){
    this.fileUploadOutput = await this.tstListCommon(this._stripe.FILES,this.fileUploadParam); 
  }


  // async _createCardToken(){
  //   let params = {
  //     "card[number]": 4242424242424242,
  //     "card[exp_month]": 10,
  //     "card[exp_year]": 2018,
  //     "card[cvc]": 100
  //   };
  //   let res = await this.createCommon(this._stripe.TOKENS,params);
  //   console.log(res);
  // }

  // _createBankAccountToken(){
  //   let params = {
  //     "bank_account[country]": "US",
  //     "bank_account[currency]": "usd",
  //     "bank_account[account_holder_name]": "Lily Thomas",
  //     "bank_account[account_holder_type]": "individual",
  //     "bank_account[routing_number]": "110000000",
  //     "bank_account[account_number]": "000123456789",
  //   };
  //   let res = this.createBankAccountToken(params);
  //   console.log(res);
  // }

  // _createPIIToken(){
  //   let params = {
  //     "pii[personal_id_number]": "00000000",
  //   };
  //   let res = this.createBankAccountToken(params);
  //   console.log(res);
  // }

  // _retrieveToken(){
  //   let id = "tok_19uvM9GhaJuqPLqdo57PENTu";
  //   let res = this.retrieveToken(id);
  // }


// Public functions ----------------------------------

// Customer =====================

  async createCustomer(params){
    return await this.createCommon(this._stripe.CUSTOMERS,params); 
  }

  // createCustomer(params){
  //   let bodyUrlEncoded = this.getParamsUrlEncoded(params);
  //   console.log(bodyUrlEncoded);

  //   let url = this._stripe.CUSTOMERS;
  //   let res = this.sendData(url,bodyUrlEncoded);

  // }

  retrieveCustomer(customerId){
    let url = this._stripe.CUSTOMERS 
              + "/" + customerId;
    // console.log(url);
    let res = this.getData(url);
  }


  updateCustomer(customerId,params){
    let bodyUrlEncoded = this.getParamsUrlEncoded(params);
    let url = this._stripe.CUSTOMERS 
              + "/" + customerId;
    let res = this.sendData(url,bodyUrlEncoded);
  }


  deleteCustomer(customerId){
    let url = this._stripe.CUSTOMERS 
              + "/" + customerId;
    console.log("url--------",url);              
    let res = this.deleteData(url);
  }

  listCustomers(params){
    let limit = params['limit'];
    console.log(limit);
    let url = this._stripe.CUSTOMERS;
    url = url + "?limit=" + limit;
    console.log(url);
    let res = this.getData(url);
    console.log("res-----------",res);

  }

 

// Charge =====================

  createCharge(params){
    let bodyUrlEncoded = this.getParamsUrlEncoded(params);
    let url = this._stripe.CHARGES;
    let res = this.sendData(url,bodyUrlEncoded);
    return res;
  }


  retrieveCharge(chargeId){
    let url = this._stripe.CHARGES 
              + "/" + chargeId;
    let res = this.getData(url);
    return res;
  }


  updateCharge(id,params){
    let bodyUrlEncoded = this.getParamsUrlEncoded(params);
    let url = this._stripe.CHARGES 
              + "/" + id;
    let res = this.sendData(url,bodyUrlEncoded);
    return res;
  }

  captureCharge(id,params?){
    let bodyUrlEncoded = this.getParamsUrlEncoded(params);
    let url = this._stripe.CHARGES 
              + "/" + id + "/capture";
    let res = this.sendData(url,bodyUrlEncoded);
    return res;
  }


  listCharges(params){
    let res = this.listCommon(this._stripe.CHARGES,params);
    return res;
  }


// Event =====================

  retrieveEvent(id){
    return this.retrieveCommon(this._stripe.EVENTS,id);
  }

  listEvents(params){
    let res = this.listCommon(this._stripe.EVENTS,params);
    return res;
  }



// Subscription =====================

  async createSubscription(params){
    // let bodyUrlEncoded = this.getParamsUrlEncoded(params);
    // let url = this._stripe.SUBSCRIPTIONS;
    // let res = await this.sendData(url,bodyUrlEncoded);
    return await this.createCommon(this._stripe.SUBSCRIPTIONS,params);
  }

  async listSubscriptions(params){
    let res = await this.listCommon(this._stripe.SUBSCRIPTIONS,params);
    return res;
  }

  async updateSubscription(id,params){
    return await this.updateCommon(this._stripe.SUBSCRIPTIONS,id,params);
  }

  async cancelSubscription(id){
    let url = this._stripe.SUBSCRIPTIONS 
              + "/" + id;
    let res = await this.deleteData(url);
  }

  async retrieveSubscription(id){
    let url = this._stripe.SUBSCRIPTIONS 
              + "/" + id;
    let res = await this.getData(url);
    return res;
  }



// Refund =====================


  listRefunds(params){
    let res = this.listCommon(this._stripe.REFUNDS,params);
    return res;
  }


  updateRefund(id,params){
    return this.updateCommon(this._stripe.REFUNDS,id,params);
  }


  retrieveRefund(id){
    return this.retrieveCommon(this._stripe.REFUNDS,id);
  }

  createRefund(params){
    return this.createCommon(this._stripe.REFUNDS,params);
  }



// Token =====================

  createBankAccountToken(params){
    return this.createCommon(this._stripe.TOKENS,params);
  }

  createPIIToken(params){
    return this.createCommon(this._stripe.TOKENS,params);
  }


  createCardToken(params){
    let bodyUrlEncoded = this.getParamsUrlEncoded(params);
    let url = this._stripe.TOKENS;
    let res = this.sendData(url,bodyUrlEncoded);

  }


  retrieveToken(id){
    return this.retrieveCommon(this._stripe.TOKENS,id);
  }


// Sku =====================

  async createSku(params){
    return await this.createCommon(this._stripe.SKUS,params);
  }

  async retrieveSku(id){
    return await this.retrieveCommon(this._stripe.SKUS,id);
  }

  async updateSku(id,params){
    return await this.updateCommon(this._stripe.SKUS,id,params);
  }

  async deleteSku(id){
    return await this.deleteCommon(this._stripe.SKUS,id);
  }

  async listSkus(params){
    return  await this.listCommon(this._stripe.SKUS,params);
  }

// Plan =====================

  async createPlan(params){
    return await this.createCommon(this._stripe.PLANS,params);
  }

  async retrievePlan(id){
    return await this.retrieveCommon(this._stripe.PLANS,id);
  }

  async updatePlan(id,params){
    return await this.updateCommon(this._stripe.PLANS,id,params);
  }

  async deletePlan(id){
    return await this.deleteCommon(this._stripe.PLANS,id);
  }

  async listPlans(params){
    return  await this.listCommon(this._stripe.PLANS,params);
  }


// Order ===================

  async createOrder(params){
    return await this.createCommon(this._stripe.ORDERS,params);
    // let bodyUrlEncoded = this.getParamsUrlEncoded(params);
    // let url = this._stripe.ORDERS;
    // let res = await this.sendData(url,bodyUrlEncoded);
    // return res;
  }


// Product ===================

  async createProduct(urlEncodedStr){
    let url = this._stripe.PRODUCTS;
    let res = await this.sendData(url,urlEncodedStr);
    return res;
  }

  async retrieveProduct(id){
    let url = this._stripe.PRODUCTS 
              + "/" + id;
    let res = await this.getData(url);
    return res;
  }

  async updateProduct(id,params){
    return await this.updateCommon(this._stripe.PRODUCTS,id,params);
  }

  async listProducts(params){
    return await this.listCommon(this._stripe.PRODUCTS,params);
  }

  async deleteProduct(id){
    let url = this._stripe.PRODUCTS 
              + "/" + id;
    let res = await this.deleteData(url);
    return res;
  }




// private functions -----------------------

  // private getDataO(url: String) {
  //   let headers = new Headers()
  //   headers = this.getStripeHeaders();
  //   let options = new RequestOptions({ headers: headers });

  //   return this._http.get(url,options)
  //               .map((r:Response) => r.json())
  //               .subscribe(
  //                 data => console.log("sub res",data)
  //                 );

  // }

  private addSameNameParams(params: any,paramName: string,attrs:string[]): string{
    let bodyUrlEncoded = this.getParamsUrlEncoded(params);
    let str = "";
    for (var attr in attrs) {
      str += "&" + encodeURIComponent(paramName) + "=" + encodeURIComponent(attrs[attr]);
    }
    bodyUrlEncoded += str;
    return bodyUrlEncoded;
  }


  private getData(url: String): Promise<Response>{
    let headers = new Headers()
    headers = this.getStripeHeaders();
    let options = new RequestOptions({ headers: headers });

    return this._http.get(url,options)
                .toPromise()
                .then(this.extractData)
                .catch(this.handleError);
  }

  private deleteData(url: String): Promise<Response>{
    console.log("delete url-----",url);
    let headers = new Headers()
    headers = this.deleteStripeHeaders();
    let options = new RequestOptions({ headers: headers });

    return this._http.delete(url,options)
                .toPromise()
                .then(this.extractData)
                .catch(this.handleError);
  }



  private sendData(url: String, data?: any): Promise<Response>{
    const body = data;
    let headers = new Headers()
    headers = this.postStripeHeaders();
    let options = new RequestOptions({ headers: headers });
    return this._http.post(url, body ,options)
                .toPromise()
                .then(this.extractData)
                .catch(this.handleError);
    
  }

  private sendFile(url: String, file: File, purpose: string): Promise<Response>{
    let formData: FormData = new FormData();
    formData.append('purpose',purpose);
    formData.append('file',file,file.name);
    let headers = new Headers()
    headers = this.postStripeFileHeaders();
    let options = new RequestOptions({ headers: headers });
    return this._http.post(url, formData ,options)
                .toPromise()
                .then(this.extractData)
                .catch(this.handleError);
    
  }


  private extractData(res:Response) {
    console.log("Success------------");
    // console.log("Response-----------",res);
    return res;
  }

  private handleError(error: Response | any){
    console.log("error------------",error);
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} - ${err.message} - ${err.param}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Promise.reject(errMsg);
  }

	
	private postStripeHeaders(): Headers{
		let headers = new Headers();
		let access_token = this._stripeTestSecretKey;
    if (access_token) {
        headers.append('Accept','application/json');
        headers.append('Content-Type','application/x-www-form-urlencoded');
        headers.append('Authorization', "Bearer " + access_token);
    }
		return headers;
	}

	private postStripeFileHeaders(): Headers{
		let headers = new Headers();
		let access_token = this._stripeTestSecretKey;
    if (access_token) {
        headers.append('Accept','application/json');
        headers.append('Content-Type','multipart/form-data');
        headers.append('Authorization', "Bearer " + access_token);
    }
		return headers;
	}

	private getStripeHeaders(): Headers{
		let headers = new Headers();
		let access_token = this._stripeTestSecretKey;
    if (access_token) {
        headers.append('Accept','application/json');
        headers.append('Authorization', "Bearer " + access_token);
    }
		return headers;
	}

	private deleteStripeHeaders(): Headers{
		let headers = new Headers();
		let access_token = this._stripeTestSecretKey;
    if (access_token) {
        headers.append('Content-Type','application/json');
        headers.append('Authorization', "Bearer " + access_token);
    }
		return headers;
	}

  private getParamsUrlEncoded(params){
    let encoded = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      encoded.push(encodedKey + "=" + encodedValue);
    }
    let urlEncoded = encoded.join("&");
    return urlEncoded;
  }

  // private getParamsUrlEncodedByCsv(csv){
  //   let encoded = [];
  //   for (var property in params) {
  //     var encodedKey = encodeURIComponent(property);
  //     var encodedValue = encodeURIComponent(params[property]);
  //     encoded.push(encodedKey + "=" + encodedValue);
  //   }
  //   let urlEncoded = encoded.join("&");
  //   return urlEncoded;
  // }

// Common Functions ----------------------------

  private async postWithSubdirCommon(baseUrl,id,subdir){
    let url = baseUrl 
              + "/" + id + "/" + subdir;
    return await this.sendData(url);
  }

  private async getWithSubdirCommon(baseUrl,id,subdir,id2?){
    let url = baseUrl + "/" + id + "/" + subdir ;
    if (id2 != null){
      url += "/" + id2 ;
    }
    let bodyUrlEncoded = this.getParamsUrlEncoded(url);
    return await this.sendData(url,bodyUrlEncoded);
  }

  private async reversalCommon(baseUrl,id){
    return await this.postWithSubdirCommon(baseUrl,id,"reversal");
  }

  private async rejectCommon(baseUrl,id){
    return await this.postWithSubdirCommon(baseUrl,id,"reject");
  }

  private async closeCommon(baseUrl,id){
    return await this.postWithSubdirCommon(baseUrl,id,"close");
  }


  private async deleteCommon(baseUrl,id){
    let url = baseUrl + "/" + id;
    return await this.deleteData(url);
  }

  private async updateCommon(baseUrl,id,params){
    let bodyUrlEncoded = this.getParamsUrlEncoded(params);
    let url = baseUrl  + "/" + id;
    return await this.sendData(url,bodyUrlEncoded);
  }

  private async captureCommon(baseUrl,id,params?){
    let bodyUrlEncoded: any;
    if (params != null){
      bodyUrlEncoded = this.getParamsUrlEncoded(params);
    }
    let url = baseUrl  + "/" + id + "/capture";
    return await this.sendData(url,bodyUrlEncoded);
  }

  private async payCommon(baseUrl,id,params){
    let bodyUrlEncoded = this.getParamsUrlEncoded(params);
    let url = baseUrl  + "/" + id + "/pay";
    return await this.sendData(url,bodyUrlEncoded);
  }


  private async retrieveCommon(baseUrl,id?){
    let url = baseUrl 
    if(id != null){
      url += "/" + id;
    }
    return await this.getData(url);
  }

  private async createCommon(baseUrl,params,sameName?,array?){
    if (sameName != null && array != null){
      let urlEncodedStr = this.addSameNameParams(params,sameName,array);
      let url = this._stripe.PRODUCTS;
      return  await this.sendData(url,urlEncodedStr);
    }
    let bodyUrlEncoded = this.getParamsUrlEncoded(params);
    return await this.sendData(baseUrl,bodyUrlEncoded);
  }

  private async listCommon(baseUrl,params?){
    if (params != null){
      baseUrl += "?" + this.getParamsUrlEncoded(params);
    }
    return await this.getData(baseUrl);
  }




}