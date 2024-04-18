import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiInputDetailsService {

  public errorlist = [];
  public bearerstring = '';

  public headers = new HttpHeaders();
  //public tokens: AuthResponse;

  public baseurl = environment.baseUrl;

  constructor(
    //private auth: AuthService
    ) { 
    
  }
  async getBearer() {
    
    // await this.auth.retCurrentAccessToken().then((data: AuthResponse) => {
    //     this.tokens = data;
    //   }
    //   ).catch(error => console.error("Error on getting Token Object ", error));

    //return this.tokens.access_token;
    return '67c65970ae65cb62659f16a4fd64ed724a8275ab'
  }
  
}
