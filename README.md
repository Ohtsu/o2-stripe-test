

# _o2-stripe-test_ Angular2 tool to test Stripe Payment Service
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)


_o2-stripe-test_ is a tool program for testing Stripe API Service by Angular2.

_Video Explanation_
<>

## Overview 
   - _o2-stripe-test_ is a tool for those who want to check Stripe API Service by using Angular2

   - Main APIs (Subscription,Charge,Order,Account,Customer,Token,Refund,PLan,Product,SKU,Event,Dispute,Balance,Transfer,FileUpload) are supported

   - You can check the functions as both a customer (client side) and an administrator (server side).

    You can extend functions for more APIs by these base common methods.
   

## Prerequisite

   - Node.js
   - TypeScript2
   - Angular2
   - @ng-bootstrap/ng-bootstrap


## Installation


To install this program:

   - Make your own directory and change into it.

```bash
$ mkdir mydir
$ cd mydir
```
   - Make the clone as follows.

```bash
$ https://github.com/Ohtsu/o2-stripe-test.git 
```

   - Change into _o2-stripe-test_ and run "npm install".

```bash
$ cd o2-stripe-test
$ npm install 
```

   - run a local server as follows.

```bash
$ ng serve
```

   - check the first page in your browser by accessing **http://localhost:4200**.



```bash
$ ng serve
```

  - ***First Page*** 

  <img src="https://raw.githubusercontent.com/Ohtsu/images/master/stripe/o2-stripe-test-initial01.png" width= "640" >


#### Modify stripe-auth.ts

Change directory to "src/app".

```bash
$ cd src/app
```
You will find **stripe-auth.ts**.
Modify this file as follows. In firebaseConfig, paste the data above. 

```typescript
import { Injectable } from '@angular/core';

@Injectable()
export class StripeAuthService {

  constructor() { }
	
  public isLogin(): boolean {
    return true;
  }

  public getRole(): any {
    return 'admin';
  }

  // Set your keys of Stripe --------------------------------------------

  public getTestSecretKey(){
    if (this.isLogin && this.getRole() == 'admin'){
      return "sk_test_xxxxxxxxxxxxxxxxxxxxx";
    }
  }

  public getTestPublicKey(){
    if (this.isLogin && this.getRole() == 'admin'){
      return "pk_test_xxxxxxxxxxxxxxxxxxxxx";
    }
  }
  
  
}
```


#### Modify app.component.html
In the same directory, modify **app.component.html** as follows. 

```html

<h1>
  {{title}}
</h1>
<!-- Add Start -->

<o2-stripe-test [fbsBasePath] = "'images/'" [btnSelectText] = "'Browse'"></o2-stripe-test>

<!-- Add End -->


```

You can set two parameters (**fbsBasePath** and **btnSelectText**)

   - **fbsBasePath**   : Target path in your Firebase Storage 
                    (eg. 'images/' --> 'xxxxxxxx.appspot.com/images/')
   - **btnSelectText** : Title text of the select button



#### Check your Firebase Storage Rule

This sample program does not have authentication function. Therefore, it is necessary for unauthenticated users can access the target location in Firebase Storage.

So you need to set "Rule" in Firebase Storage.

From Firebase console, open **Storage** page and click **Rules** tab for changing the rule.

In this program, the upload destination is "images /" by default.

Therefore, change the rule as follows. Of course you need to change **your_project_name** to your own project name.


```typescript

service firebase.storage {
  match /b/your_project_name.appspot.com/o {
    match /images/{allPaths=**} {
      allow read, write;
    }
  }
}

```

  <img src="https://raw.githubusercontent.com/Ohtsu/images/master/firebase/FirebaseStorageRule11.png" width= "640" >


#### Restart local server
Restart the local server as follows. 

```bash
$ ng serve
```

And you will get a (Browse) button  in your browser by accessing **http://localhost:4200**.  

Click Browse Button.  
 
  <img src="https://raw.githubusercontent.com/Ohtsu/images/master/firebase/O2UploadToFbs_Initial11.png" width= "640" >

 
Select your target file for uploading.  


  <img src="https://raw.githubusercontent.com/Ohtsu/images/master/firebase/O2UploadToFbs_SelectFile12.png" width= "640" >

If you want to check the uploading process, open "Console" tab page in your browser.  

  <img src="https://raw.githubusercontent.com/Ohtsu/images/master/firebase/O2UploadToFbs_UploadComplete11.png" width= "640" >  

Next, open Firebase Storage page in your browser. If you click "File" tab, "images/" directory will be shown.  
Click "images/" directory name.  


  <img src="https://raw.githubusercontent.com/Ohtsu/images/master/firebase/O2UploadToFbs_UploadFileDir12.png" width= "640" >

Then you can find the file which you uploaded from your local computer.  

  <img src="https://raw.githubusercontent.com/Ohtsu/images/master/firebase/O2UploadToFbs_DisplayUploadedFile11.png" width= "640" >



## Version

   - Angular2     : 2.0.0
   - TypeScript   : 2.0.2
   - @ng-bootstrap/ng-bootstrap : 2.0-beta,






## Reference

- "Stripe docs",
<https://stripe.com/docs>

- "The Stripe Webhook Event Cheatsheet" ,by Pete Keen, 
<https://www.masteringmodernpayments.com/stripe-webhook-event-cheatsheet>

- "Using Stripe with Angular 2", by Minko Gechev
<http://blog.mgechev.com/2016/07/05/using-stripe-payment-with-angular-2/>

- "Taking Stripe Payments with Angular 2 and ASP.NET Core",2017/1/12, by Carl Rippon
<http://www.carlrippon.com/?p=645>



## Change Log

 - 2017.3.20 version 0.1 uploaded 

## Copyright

copyright 2017 by Shuichi Ohtsu (DigiPub Japan)


## License

MIT © [Shuichi Ohtsu](mailto:ohtsu@digipub-net.com)