import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';
import { UserDetails } from 'src/app/interfaces/user-details.interface';
import { ApiUserDetailsService } from 'src/app/services/user-details/api/api-user-details.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {


  public bte: string = '';
  public animals: Array<any> = [];
  public isLoading: boolean = true;
  public userDetails: Array<UserDetails> = [];

  private loader!: HTMLIonLoadingElement;

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private loadingCtrl: LoadingController,
    private apiUserDetails: ApiUserDetailsService

    ) {}

  async ngOnInit(){

    this.loader = await this.loadingCtrl.create({
      message: 'Loading Home Page...',
      duration: 3000,
    });

    this.loader.present(); 

    console.log("test");
    this.apiUserDetails.getUserDetails().then(async(res: Array<UserDetails>) => {
      this.userDetails = res;
      console.log(this.userDetails);
      this.loader.dismiss();
    }).catch((error: any) =>{
      console.log(error);
      this.loader.dismiss();
    });

    
  }

  test(){
    this.apiUserDetails.getUserDetails().then(async(res: Array<UserDetails>) => {
      this.userDetails = res;
      console.log(this.userDetails);
    }).catch((error: any) =>{
      console.log(error);
    });
  }

  ionViewDidEnter(){
    this.bte = 'Daniel';

    for(var i = 0; i < 10; i++){
      this.animals.push('1234' + i);
    }
  }

  hello(animal: any){
    this.bte = animal;
  }

}
