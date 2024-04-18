export class AuthResponse {
  constructor(  public access_token: string,
                public expiry_time: string,
                public token_type : string,
                public scope : string,
                public refresh_token: string) {
  
  }
}
