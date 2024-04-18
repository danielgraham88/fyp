import { Injectable } from '@angular/core';
import { AnimalDefects } from 'src/app/interfaces/animal-defects.interface';
import { ApiGlobalService } from '../../api/api-global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiAnimalDefectsService {

  private aniGenDefects: Array<AnimalDefects> = [];
  private url = this.apiglobal.baseurl + '/genetic-defects/animal-defects';

  constructor(
    private apiglobal: ApiGlobalService,
    private httpclient: HttpClient
  ) { }

  public getAniDefects(): Promise<Array<AnimalDefects>> {

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
          console.log('callAniGenDefects getAniGenDefects: data: '+ this.url);
          console.log(response);

          this.aniGenDefects = this.aniGenDefects.concat(data._embedded.animal_defects);
          resolve(this.aniGenDefects);

        } else {
          console.log('Error in Response from API');
          reject(new Error('No Result Found'));
        }

        if(response == null) {
          console.log('callAniGenDefects getAniGenDefects: resolved response null ><');
          reject(new Error('No Result Found'));
        }

      },(error: Error) => {
        //this.apiglobal.errorlist.push('getEbiAnimals:' + (error as Error).message);
        console.log((error as Error).message);
        reject(error);
      });

    });
  }

  public clearAniDefects(): void {
    this.aniGenDefects = [];
  }
}
