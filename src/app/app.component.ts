import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public herd: Array<number> = [];

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private auth: AuthService

  ) {}

  moveScreen(page: string){
    this.menuCtrl.close();
    this.router.navigateByUrl(page);
  }

  logOut(page: string){
    this.auth.clearCredentials();
    this.router.navigateByUrl(page);

  }

  getInfo(){
    return this.herd;
  }
}
