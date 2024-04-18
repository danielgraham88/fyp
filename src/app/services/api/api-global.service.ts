import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from 'src/app/providers/auth-response.model';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiGlobalService {

  public errorlist = [];
  public bearerstring = '';

  public headers = new HttpHeaders();
  public tokens: any;

  public baseurl = environment.baseUrl;

  constructor(
    private auth: AuthService
    ) { 
    
  }
  async getBearer() {
    console.log("AHHHHHHHHHHHHHHHHHHHHHHHHHH");
    await this.auth.retCurrentAccessToken().then((data: any) => {
        this.tokens = JSON.parse(data.value);
        console.log("test", this.tokens);
      }
      ).catch(error => console.error("Error on getting Token Object ", error));

    return this.tokens.access_token;
    //return '2bcaf7ccd24f624849727c8f11da92119b1135cd'
  }
  
}
