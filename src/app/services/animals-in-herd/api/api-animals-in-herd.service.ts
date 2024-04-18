import { Injectable } from '@angular/core';
import { AnimalsInHerd } from 'src/app/interfaces/animals-in-herd.interface';
import { ApiGlobalService } from '../../api/api-global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiAnimalsInHerdService {
  
  private animalsInHerd: Array<AnimalsInHerd> = [];
  private url = this.apiglobal.baseurl + '/genetic-defects/animals-in-herd';

  constructor(
    private apiglobal: ApiGlobalService,
    private httpclient: HttpClient
  ) { }

  public getAnimalsInHerd(): Promise<Array<AnimalsInHerd>> {

    return new Promise(async (resolve, reject) => {

      const token = await this.apiglobal.getBearer();

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
          console.log('callAnimalsInHerd getAnimalsInHerd: data: '+ this.url);
          console.log(response);

          this.animalsInHerd = this.animalsInHerd.concat(data._embedded.animals_in_herd);
          resolve(this.animalsInHerd);

        } else {
          console.log('Error in Response from API');
          reject(new Error('No Result Found'));
        }

        if(response == null) {
          console.log('callAnimalsInHerd getAnimalsInHerd: resolved response null ><');
          reject(new Error('No Result Found'));
        }

      },(error: Error) => {
        //this.apiglobal.errorlist.push('getEbiAnimals:' + (error as Error).message);
        console.log((error as Error).message);
        reject(error);
      });

    });
  }

  public clearAnimalsInHerd(): void {
    this.animalsInHerd = [];
  }
}
