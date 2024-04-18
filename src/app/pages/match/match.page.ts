import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';
import { AnimalsInHerd } from 'src/app/interfaces/animals-in-herd.interface';
import { MatchAnimals } from 'src/app/interfaces/match-animals.interface';
import { ApiAnimalsInHerdService } from 'src/app/services/animals-in-herd/api/api-animals-in-herd.service';
import { ApiMatchAnimalsService } from 'src/app/services/match-animals/api/api-match-animals-service';

@Component({
  selector: 'app-match',
  templateUrl: './match.page.html',
  styleUrls: ['./match.page.scss'],
})
export class MatchPage implements OnInit {

  public bte: string = '';
  public input: string[] = [];
  public input2: string[] = []; 
  public selectedAnimal: string | null = null;
  public selectedAnimal2: string | null = null;
  public matchResult: number | null = null; 

  public animalsInHerd: Array<AnimalsInHerd> = [];
  public matchAnimals: Array<MatchAnimals> = [];

  private loader!: HTMLIonLoadingElement;
  public isLoading: boolean = false;

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private apiAnimalsInHerd: ApiAnimalsInHerdService,
    private apiMatchAnimals: ApiMatchAnimalsService,
    private loadingCtrl: LoadingController
    ) {}

  async ngOnInit(){
    this.deselectAnimal(); 

    this.loader = await this.loadingCtrl.create({
      message: 'Loading Herd...',
      duration: 3000,
    });

    this.loader.present();

    this.apiAnimalsInHerd.getAnimalsInHerd().then(async(res: Array<AnimalsInHerd>) => {
      this.animalsInHerd = res;
      this.isLoading = false; 
      console.log('MATCH_PAGE.TS' , this.animalsInHerd);
      this.loader.dismiss();
    }).catch((error: any) =>{
      console.log(error);
      this.isLoading = false; 
      this.loader.dismiss();
    });
  }

  ionViewDidEnter(){

  }

  selectAnimal(animal: AnimalsInHerd) {
    this.selectedAnimal = animal.animal_number;
    this.selectedAnimal2 = null;
    this.matchResult = null;
  }

  selectAnimal2(animal: AnimalsInHerd) {
    this.selectedAnimal2 = animal.animal_number;
    this.matchResult = null
  }

  deselectAnimal() {
    this.selectedAnimal = null;
    this.selectedAnimal2 = null;
    this.matchResult = null;
  }

  getStarRating() {
    if (this.matchResult === null) {
      return { fullStars: 0, halfStars: 0, emptyStars: 5 };
    }
  
    const rating = this.matchResult;
  
    const fullStars = Math.floor(rating / 2);
    const halfStars = rating % 2 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;
  
    return { fullStars, halfStars, emptyStars };
  }

  match() { 
    if (this.selectedAnimal && this.selectedAnimal2) {
      this.isLoading = true; 
      console.log('MATCH_PAGE.TS 111: ', this.selectedAnimal, '  222: ', this.selectedAnimal2);
      this.apiMatchAnimals.getMatchAnimals(this.selectedAnimal, this.selectedAnimal2).then((res: Array<MatchAnimals>) => {
        if (res && res.length > 0 && res[res.length - 1].return_code === '0') {
          this.matchResult = +res[res.length - 1].rating;
          console.log('Rating: ', this.matchResult);
        } else {
          console.log('No match found or error in response');
          this.matchResult = null;
        }
        this.isLoading = false; 
        console.log('MATCH_PAGE.TS match()', this.matchAnimals);
      }).catch((error: any) => {
        console.log(error);
        this.matchResult = null;
        this.isLoading = false; 
      });
    } else {
      this.matchResult = null;
    }
  }

  async callApi(){
    await this.apiAnimalsInHerd.getAnimalsInHerd().then(async(res: Array<AnimalsInHerd>) => {
      this.animalsInHerd = res;
    }).catch((error: any) =>{
      console.log(error);
    });
  }

}