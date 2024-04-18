import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Network } from '@capacitor/network';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { AuthResponse } from 'src/app/providers/auth-response.model';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private loader: any;

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private auth: AuthService
  ) { }

  ngOnInit() {
    null
  }

  ionViewDidEnter(){
    this.menuCtrl.close();
    this.menuCtrl.swipeGesture(false);
  }

  async moveHome() {

    this.loader = await this.loadingCtrl.create({
      spinner: 'crescent',
      message: 'Signing in...'
    });

    await this.loader.present().then(() => { });

    await this.auth.authenticate().then(async (res: any) => {

      //console.log(res);
      console.log("auth process complete");

      const status = Network.getStatus();

      if((await status).connected) {
        // call apis if you want
      }

      this.loader.dismiss();

      this.router.navigate(["/home"], { replaceUrl: true });
          

    }).catch(async error => {

      console.log(error);

      if (error == "access_denied") {
        const alert = await this.alertController.create({
          header: 'Authorization',
          subHeader: 'Access Denied',
          message: 'You must authorize the use of APIs to use this app.',
          buttons: ['OK']
        });
        this.loader.dismiss();
        await alert.present();
      } else if (error == "no_internet") {

        this.loader.dismiss();

        const alert = await this.alertController.create({
          header: 'Internet Error',
          subHeader: 'No internet connection',
          message: 'You must have internet connection to login for the first time or for a fresh login.',
          buttons: ['OK']
        });
        this.loader.dismiss();
        await alert.present();

      } else {

        const alert = await this.alertController.create({
          header: 'Unexpected Error',
          subHeader: 'An error has occuered that was not expected',
          message: 'If the issue persists after a restart then please contact ICBF',
          buttons: ['OK']
        });

        this.router.navigate(["/dashboard"], { replaceUrl: true });

        this.loader.dismiss();
        await alert.present();
      }

    });
  }

  async logForm() {

    this.loader = await this.loadingCtrl.create({
      spinner: 'crescent',
      message: 'Signing in...'
    });

    await this.loader.present().then(() => { });

    //this.auth.clearCredentials();
    await this.auth.newIcbfLogin({'bte': 'D2690749', 'password': 'kev'}).then(async (res: any) => {

      console.log("auth process complete");
      this.loader.dismiss();
      //call apis
      this.router.navigate(["/home"], { replaceUrl: true });

    }).catch(async error => {
      console.log(error);

      if (error == "access_denied") {
        const alert = await this.alertController.create({
          header: 'Authorization',
          subHeader: 'Access Denied',
          message: 'You must authorize the use of APIs to use this app.',
          buttons: ['OK']
        });
        this.loader.dismiss();
        await alert.present();
      } else if (error == "no_internet") {

        this.loader.dismiss();

        const alert = await this.alertController.create({
          header: 'Internet Error',
          subHeader: 'No internet connection',
          message: 'You must have internet connection to login for the first time or for a fresh login.',
          buttons: ['OK']
        });
        this.loader.dismiss();
        await alert.present();

      } else {

        const alert = await this.alertController.create({
          header: 'Unexpected Error',
          subHeader: 'An error has occuered that was not expected',
          message: 'If the issue persists after a restart then please contact ICBF',
          buttons: ['OK']
        });
        this.loader.dismiss();
        await alert.present();
      }
    });
  }


}
