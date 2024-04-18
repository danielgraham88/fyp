import { Injectable } from '@angular/core';
import { UserDetails } from 'src/app/interfaces/user-details.interface';
import { ApiGlobalService } from '../../api/api-global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiUserDetailsService {
  
  private userDetails: Array<UserDetails> = [];
  private url = this.apiglobal.baseurl + '/genetic-defects/user-details';

  constructor(
    private apiglobal: ApiGlobalService,
    private httpclient: HttpClient
  ) { }

  public getUserDetails(): Promise<Array<UserDetails>> {

    return new Promise(async (resolve, reject) => {

      const token = await this.apiglobal.getBearer();
console.log("test", token);
      let data: any;

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization : 'Bearer ' + token
        })
      };

      this.httpclient.get(this.url, httpOptions).subscribe((response: any) => {
        if(response != null) {
          data = response;
          console.log('callUserDetails getUserDetails: data: '+ this.url);
          console.log(response);

          this.userDetails = this.userDetails.concat(data._embedded.user_details);
          resolve(this.userDetails);

        } else {
          console.log('Error in Response from API');
          reject(new Error('No Result Found'));
        }
        if(response == null) {
          console.log('callUserDetails getUserDetails: resolved response null ><');
          reject(new Error('No Result Found'));
        }

      },(error: Error) => {
        //this.apiglobal.errorlist.push('getEbiAnimals:' + (error as Error).message);
        console.log((error as Error).message);
        reject(error);
      });

    });
  }

  public clearUserDetails(): void {
    this.userDetails = [];
  }
}
