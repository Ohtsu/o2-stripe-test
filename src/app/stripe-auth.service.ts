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
      return "sk_test_rMXxjihD48UaKkhkZOZeUu2z";
    }
  }

  public getTestPublicKey(){
    if (this.isLogin && this.getRole() == 'admin'){
      return "pk_test_43JRel8PZxr00sCQOUm3I4CY";
    }
  }
  
  
}
