import { Injectable } from '@angular/core';
import { MatchAnimals } from 'src/app/interfaces/match-animals.interface';
import { ApiGlobalService } from '../../api/api-global.service';
import { HttpClient, HttpHeaders , HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiMatchAnimalsService {
  
  private matchAnimals: Array<MatchAnimals> = [];
  private url = this.apiglobal.baseurl + '/genetic-defects/match-animals';

  constructor(
    private apiglobal: ApiGlobalService,
    private httpclient: HttpClient
  ) { }

  public getMatchAnimals(animalNumber1:string, animalNumber2:string): Promise<Array<MatchAnimals>> {

    return new Promise(async (resolve, reject) => {

      const token = await this.apiglobal.getBearer();

      let data: any;

      console.log('API-MATCH-ANIMALS - 111 ', animalNumber1, '  222: ', animalNumber2)
      const params = new HttpParams().set('animal_number1', animalNumber1).set('animal_number2', animalNumber2);

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization : 'Bearer ' + token
        }), 
        params: params 
      };

      this.httpclient.get(this.url, httpOptions).subscribe((response: any) => {
        if(response != null) {
          data = response;
          console.log('callMatchAnimals MatchAnimals: data: '+ this.url);
          console.log('RESPONSE === ', response);
          console.log('DATA === ', data);


          this.matchAnimals = this.matchAnimals.concat(data._embedded.match_animals);
          console.log('API-MATCH-ANIMALS : ', this.matchAnimals);
          resolve(this.matchAnimals);

        } else {
          console.log('Error in Response from API');
          reject(new Error('No Result Found'));
        }

        if(response == null) {
          console.log('callMatchAnimals MatchAnimals: resolved response null ><');
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
    this.matchAnimals = [];
  }
}
