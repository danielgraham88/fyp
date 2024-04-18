export class AccessTokenRequest {

  constructor(  public grant_type : string,
              public client_id : string,
              public client_secret: string,
              public code : string,
              public redirect_uri: string) {
  
  }
}
