import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';
import { AnimalsInHerd } from 'src/app/interfaces/animals-in-herd.interface';
import { ApiAnimalsInHerdService } from 'src/app/services/animals-in-herd/api/api-animals-in-herd.service';
import { AnimalDefects } from 'src/app/interfaces/animal-defects.interface';
import { ApiAnimalDefectsService } from 'src/app/services/animal-defects/api/api-animal-defects.service';
import { ApiUserDetailsService } from 'src/app/services/user-details/api/api-user-details.service';
import { UserDetails } from 'src/app/interfaces/user-details.interface';

import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-input',
  templateUrl: './input.page.html',
  styleUrls: ['./input.page.scss'],
})
export class InputPage implements OnInit {
  public bte: string = '';
  public input: Array<any> = [];
  public input2: Array<any> = [];

  public isLoading: boolean = true;

  public animalsInHerd: Array<AnimalsInHerd> = [];
  public aniDefects: Array<AnimalDefects> = [];
  public userDetails: Array<UserDetails> = [];
  isSupported = false;

  private loader!: HTMLIonLoadingElement;

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private apiAnimalsInHerd: ApiAnimalsInHerdService,
    private apiAniDefects: ApiAnimalDefectsService,
    private loadingCtrl: LoadingController,
    private apiUserDetails: ApiUserDetailsService,

    ) {}  

  async ngOnInit() {

    this.loader = await this.loadingCtrl.create({
      message: 'Loading Herd...',
      duration: 3000,
    });

    this.loader.present();   

    this.apiUserDetails.getUserDetails().then(async(res: Array<UserDetails>) => {
      this.userDetails = res;
      console.log(this.userDetails);
    }).catch((error: any) =>{
      console.log(error);
    });

    this.apiAnimalsInHerd.getAnimalsInHerd().then(async(res: Array<AnimalsInHerd>) => {
      this.animalsInHerd = res;
      console.log('INPUT_PAGE.TS' , this.animalsInHerd);
    }).catch((error: any) =>{
      console.log(error);
    });

    this.apiAniDefects.getAniDefects().then(async(res: Array<AnimalDefects>) => {
      this.aniDefects = res;
      console.log(this.aniDefects);
      this.loader.dismiss();

    }).catch((error: any) =>{
      console.log(error);
      this.loader.dismiss();

    });
  

  }

  startScan = async () => {

    await BarcodeScanner.checkPermission({ force: true });
  

    BarcodeScanner.hideBackground();
  
    const result = await BarcodeScanner.startScan(); 
  
    if (result.hasContent) {
      console.log(result.content); 
    }
  };
  stopScan = () => {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  };

  ionViewDidEnter(){
    // this.bte = 'Daniel';

    // for(var i = 0; i < 10; i++){
    //   this.input.push('ANIMAL' + i);
    // }

    // for(var i = 0; i < 10; i++){
    //   this.input2.push('GENE' + i);
    // }
  }

  // hello(input: any){
  //   this.bte = input;
  // }

  // async callApi(){
  //   // await this.apiAniGenes.getAniGenes().then(async(res: Array<AnimalGenes>) => {
  //   //   this.aniGenes = res;
  //   //   console.log(this.aniGenes);
  //   // }).catch((error: any) =>{
  //   //   //call alert to user with error
  //   //   console.log(error);
  //   // });
  // }
}