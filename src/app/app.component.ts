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
  fileUploadFile:any;


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


  async serverRegisterCustomer(token){
    if (this.localInputParams == null){
      this.localOutput = "No Input Data";
      return;
    }
    try{
      let udata = JSON.parse(this.localInputParams);
      udata["source"]=token;
      let res = await this.createCustomerByLocal(udata);
      this.localOutput = JSON.stringify(res);
    }
    catch(e){
      this.localOutput = JSON.stringify(e);
    }

  }


  setUpClientCard() {
    Stripe.setPublishableKey(this._stripeTestPublicKey);
  }

  getClientCardData(number, month, year, cvc) {
    this.getClientCardToken(number, month, year, cvc);
  }

  getClientCardToken(number, month, year, cvc) {
    var cardData = {"number": number, "exp_month": month, "exp_year": year, "cvc": cvc};

    Stripe.card.createToken(cardData,
      (status, response) => { 
        if (status === 200) {
          console.log("the card response: ", response);
          this.cardToken = response.id;
          this.serverRegisterCustomer(this.cardToken);
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
         let file = event.srcElement.files[0];
         console.log("file---------",file);
         this.fileUploadId = file.name;
         this.fileUploadFile = file;
        //  let uploader = document.getElementById("btnUpload");
        // // //  console.log("targetFile------------",targetFile);
        //  let targetFile = "C:/Users/ohtsu/Pictures/0000090_300.jpg";
        //  console.log("targetFile------------",targetFile);
        //  let res = await this.sendFile(this._stripe.FILES, targetFile,"dispute_evidence");
        //  console.log("upload res-----",res);
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





// __ Test Event ____

  async _retrieveEvent(){
    this.eventOutput = await this.tstRetrieveCommon(this._stripe.EVENTS,this.eventId); 
  }



  async _listEvents(){
    this.eventOutput = await this.tstListCommon(this._stripe.EVENTS,this.eventParam); 
  }

  


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

// __ Test File Uploads ____

  async _createFileUpload(){
    // this.fileUploadOutput = await this.tstCreateCommon(this._stripe.FILES,this.fileUploadParam); 
    if (this.fileUploadFile == null ){
      console.log("File is not set");
      return;
    }
    // let uploadButton = document.getElementById("btnUpload");
    let targetFile = this.fileUploadFile;
    console.log("targetFile------------",targetFile);
    let res = await this.sendFile(this._stripe.FILES, targetFile,"identity_document");
    console.log("upload res-----",res);
    
    // console.log("_createFileUpload");    
  }


  async _retrieveFileUpload(){
    this.fileUploadOutput = await this.tstRetrieveCommon(this._stripe.FILES,this.fileUploadId); 
  }


  async _listFileUploads(){
    this.fileUploadOutput = await this.tstListCommon(this._stripe.FILES,this.fileUploadParam); 
  }




// Public functions ----------------------------------

// Customer =====================

  async createCustomerByLocal(params){
    return await this.createCommon(this._stripe.CUSTOMERS,params); 
  }

// private functions -----------------------


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
    formData.append('file',file.name);
    let headers = new Headers()
    headers = this.postStripeFileHeaders();
    let options = new RequestOptions({ headers: headers });
    return this._http.post(url, formData ,options)
                .toPromise()
                .then(this.extractData)
                .catch(this.handleError);
    
  }

  // private sendFile(url: String, fileLocalPath: string, purpose: string): Promise<Response>{
  //   let formData: FormData = new FormData();
  //   formData.append('file',fileLocalPath);
  //   formData.append('purpose',purpose);
  //   let headers = new Headers()
  //   headers = this.postStripeFileHeaders();
  //   let options = new RequestOptions({ headers: headers });
  //   return this._http.post(url, formData ,options)
  //               .toPromise()
  //               .then(this.extractData)
  //               .catch(this.handleError);
    
  // }


  private extractData(res:Response) {
    console.log("Success------------");
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
		let access_token = this._stripeTestPublicKey //._stripeTestSecretKey;
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
