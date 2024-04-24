import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';

import { AnimalDefects } from 'src/app/interfaces/animal-defects.interface';
import { UserDetails } from 'src/app/interfaces/user-details.interface';

import { ApiAnimalDefectsService } from 'src/app/services/animal-defects/api/api-animal-defects.service';
import { ApiUserDetailsService } from 'src/app/services/user-details/api/api-user-details.service';

@Component({
  selector: 'app-information',
  templateUrl: './information.page.html',
  styleUrls: ['./information.page.scss'],
})
export class InformationPage implements OnInit {
  public bte: string = '';
  public animals: any[] = [];  

  public aniDefects: Array<AnimalDefects> = [];
  public userDetails: Array<UserDetails> = [];

  public isLoading: boolean = true;

  private loader!: HTMLIonLoadingElement;

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private apiAniDefects: ApiAnimalDefectsService,
    private apiUserDetails: ApiUserDetailsService,

    private loadingCtrl: LoadingController,
    private appComponent: AppComponent

  ) {}

  async ngOnInit() {
    // for (let i = 0; i < 10; i++) {
    //   this.animals.push({ name: 'ANIMAL ' + i, expanded: false, info: 'Additional info for ANIMAL ' + i });
    // }

    this.apiUserDetails.getUserDetails().then(async(res: Array<UserDetails>) => {
      this.userDetails = res;
      console.log(this.userDetails);
    }).catch((error: any) =>{
      console.log(error);
    });

    this.loader = await this.loadingCtrl.create({
      message: 'Loading Information...',
      duration: 3000,
    });

    this.loader.present();

    this.apiAniDefects.getAniDefects().then(async (res: Array<AnimalDefects>) => {
      this.aniDefects = res.map(item => ({ ...item, expanded: false })); 
      console.log(this.aniDefects);
      this.loader.dismiss();
    }).catch((error: any) => {
      console.log(error);
      this.loader.dismiss();
    });
  }

  // toggleCard(animal: any) {
  //   animal.expanded = !animal.expanded;
  // } 

  toggleCard(aniDefects: any) {
    aniDefects.expanded = !aniDefects.expanded;
  }

  // toggleCard(selectedAnimal: any) {
  //   this.animals.forEach(animal => {
  //     if (selectedAnimal !== animal) {
  //       animal.expanded = false;
  //     }
  //   });
  
  //   selectedAnimal.expanded = !selectedAnimal.expanded;
  //   console.log("here")
  // }

  ionViewDidEnter() {
    this.bte = 'Daniel';
    this.appComponent.getInfo();
    
  }

//   async callApi(){
//     await this.apiAniDefects.getAniDefects().then(async(res: Array<AnimalDefects>) => {
//       this.aniDefects = res;
//       console.log(this.aniDefects);
//     }).catch((error: any) =>{
//       //call alert to user with error
//       console.log(error);
//     });
//   }
}
