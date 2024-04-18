import { Injectable } from '@angular/core';
import { AccessTokenRequest } from '../../providers/access-token-request.model';
import { RefreshTokenRequest } from '../../providers/refresh-token-request.model';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../../providers/auth-response.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { Preferences } from '@capacitor/preferences';
import { Network } from '@capacitor/network';
import { map } from 'rxjs/operators';
import { InAppBrowserEvent, InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = environment.authUrl;
  private clientId: string = environment.clientId;
  private secret: string = environment.secret;
  private redirectUri = environment.redirectUri;
  public baseurl = environment.baseUrl;

  public browserActive: boolean = false;
  public isConnecting: boolean = false;
  
  public currentTokens: any;

  public defaultTokens: any;

  constructor(
    public http: HttpClient,
    private iab: InAppBrowser
    ) { 
    console.log("Welcome to the auth constructor");
    // this.defaultTokens = {
    //   access_token: "3d1a6e5daf52494521e13fea6a59c0048f2f9620",
    //   expiry_time: '2022-12-30T14:28:25.538Z',
    //   token_type: "Bearer",
    //   scope: "HerdDetails HerdFertility HerdHealth HerdLactation HerdPlus",
    //   refresh_token: "ebd124b04183630a8c9e1fbe001f6eba2a90de1d"
    // }
    // this.saveTokens(this.defaultTokens);
    //this.clearCredentials();
  }
  
  test() {
    console.log(this.authUrl);
  }
  public authenticate() {
    // this.clearCredentials();
    let that = this;
    return new Promise(async function (resolve, reject) {

      await that.getTokens()
        .then(async token => {
          console.log("Got token from storage AUTH", token);
          //console.log(token);
          that.currentTokens = token;

          if (moment().isAfter(that.currentTokens.expiry_time)) {
            console.log("Access Token Expired, use refresh token");

            const status = Network.getStatus();

            if((await status).connected) {
              await that.useRefreshToken(that.currentTokens.refresh_token)
                .then(data => {
                  console.log("successfully used refresh token", data);
                  console.log("Ready to access webapp!");
                  that.currentTokens = data;
                  resolve(data);
                })
                .catch(async errors => {
                  console.error("Error retrieving refresh token", errors);
                  if (errors.status == 0 /* unknown */) {
                    
                    console.log("Possible issue with signal, returning current tokens");
                    resolve(that.currentTokens);
                  } else {
                    console.log("Refresh token rejected, begin icbfLogin process");
                    //reject('no_token');
                    await that.icbfLogin()
                      .then(success => console.log("After refresh token attempt, ready to access webapp", success))
                      .catch(error => console.error("Error on logging in ", error)); 
                  }

                });
            } else {
              console.log("Access token expired but not internet connection to get new token, continuing to app");
              resolve(token);
            }

          } else {
            console.log("Ready to access webapp!");
            resolve(token);
          }

        })
        .catch(async errors => {
          console.error("No saved tokens available", errors);

          const status = Network.getStatus();

          if((await status).connected) {
            //reject('no_token');
            await that.icbfLogin()
              .then(data => {
                console.log("Access token obtained after icbfLogin: ", data);
                resolve(data);
              }
              ).catch(error => {
              console.error("Error on logging in ", error);
              reject("access_denied");
            }); 
          } else{
            reject("no_internet");
          }
        });
    });
  }

  public retCurrentAccessToken(): Promise<AuthResponse> {

    return new Promise(async (resolve, reject) => {

      //console.log("retCurrentAccessToken");

        await this.getTokens()
          .then(async (token: AuthResponse) => {
            console.log(token);
            this.currentTokens = token;
            // console.log("-----------------------")
            // console.log(this.currentTokens)

            if (moment().isAfter(this.currentTokens.expiry_time)) {
              
              const status = Network.getStatus();

              if((await status).connected) {
                console.log("Access Token Expired, use refresh token");
                this.useRefreshToken(this.currentTokens.refresh_token)
                  .then(data => {
                    console.log("successfully used refresh token", data);
                    console.log("Ready to access webapp!");
                    this.currentTokens = data;
                    resolve(data);
                  }).catch(err => {
                    console.log("Refresh token use failed", err);
                    //reject(err);
                    resolve(token);
                  });
              } else {
                console.log("Access token expired but not internet connection to get new token, continuing to app");
                resolve(token);
              }
              
            } else {
              //console.log("Access Token Still Valid")
              resolve(this.currentTokens);
            }
          });

    });

  }

  // public icbfLogin() {

  //   let browserRef: any;
  //   let complete: boolean = false;
  //   let that = this;

  //   console.log("Starting log in process");

  //   return new Promise(function (resolve, reject) {

  //       that.isConnecting = true;
  //       var options = "location=no,clearcache=yes,toolbar=yes,clearsessioncache=yes,hidden=yes,hardwareback=no,zoom=no";
  //       browserRef = (<any>window).cordova.InAppBrowser.open(that.authUrl + "/authorize?response_type=code&client_id=" + that.clientId + "&redirect_uri=" + that.redirectUri + "&state=1", "_blank", options);
  //       console.log('URL FOR AUTH ' + that.authUrl + "/authorize?response_type=code&client_id=" + that.clientId + "&redirect_uri=" + that.redirectUri + "&state=1");
  //       that.browserActive = true;
  //       var parsedResponse;

  //       browserRef.addEventListener('loadstop', function () {

  //         if (browserRef != undefined) {
  //           browserRef.show();
  //           that.isConnecting = false;
  //         }
  //       });

  //       browserRef.addEventListener("loadstart", async (event: any) => {

  //         if ((event.url).indexOf(that.redirectUri) === 0) {

  //           browserRef.hide();

  //           browserRef.removeEventListener("exit", () => { });
  //           that.isConnecting = false;
  //           that.browserActive = false;

  //           parsedResponse = that.getAuthorizationCode(event.url);
  //           console.log("Authorisation code", parsedResponse);

  //           if (parsedResponse["code"] !== undefined && parsedResponse["code"] !== null) {

  //             //console.log("parsedResponse[code] !== undefined : " + parsedResponse["code"]);

  //             await that.getAccessToken(parsedResponse["code"])
  //               .then((token: AuthResponse) => {

  //                 complete = true;
  //                 browserRef.close();
  //                 console.log("Access token obtained", token.access_token);

  //                 that.currentTokens = token;
  //                 that.saveTokens(token);
          
  //                 resolve(token);

  //               })
  //               .catch(error => {
  //                 console.error("Access code request failed", error);
  //                 browserRef.close();
  //                 reject(error);
  //               });

  //           } else if (parsedResponse["error"] !== undefined && parsedResponse["error"] !== null) {
  //             console.log("parsedResponse[error] !== undefined  : " + parsedResponse["error_description"]);

  //             parsedResponse["error_description"] = parsedResponse["error_description"].replace(/\+/g, " "); //replace the + with space
  //             browserRef.close();
  //             reject(parsedResponse["error_description"]);

  //           } else {
  //             console.error("rejected");
  //             browserRef.close();
  //             reject("Problem authenticating with ICBF");
  //           }
  //         }
  //       });
        
  //       browserRef.addEventListener("exit", function () {
  //         that.browserActive = false;
  //         that.isConnecting = false;
  //         if (complete) {
  //           //console.log("Exiting inAppBrowser");
  //           resolve(that.currentTokens);
  //         } else {
  //           reject("The ICBF sign in flow was cancelled");
  //         }
  //       });

  //   });

  // }

  public async icbfLogin() {

    let complete = false;
    const that = this;

    console.log("Starting log in process");

    return new Promise(function(resolve, reject) {

      that.isConnecting = true;

      const options = "location=no,clearcache=yes,toolbar=yes,clearsessioncache=yes,hidden=yes,hardwareback=no,zoom=no";

      const browserRef = that.iab.create(that.authUrl + "/authorize?response_type=code&client_id=" + that.clientId + "&redirect_uri=" + that.redirectUri + "&state=1", "_blank", options);
      console.log('URL FOR AUTH ' + that.authUrl + "/authorize?response_type=code&client_id=" + that.clientId + "&redirect_uri=" + that.redirectUri + "&state=1");

      that.browserActive = true;
      let parsedResponse = {};

      browserRef.on('loadstop').subscribe(() => {
        if (browserRef !== undefined) {
          browserRef.show();
          that.isConnecting = false;
        }
      });

      browserRef.on('loadstart').subscribe(async (event: InAppBrowserEvent) => {

        if((event.url).indexOf(that.redirectUri) === 0) {

          browserRef.hide();

          that.isConnecting = false;
          that.browserActive = false;

          parsedResponse = that.getAuthorizationCode(event.url);
          var test: any;
          test = parsedResponse;
          console.log("Authorisation code", parsedResponse);

          if(test["code"] !== undefined && test["code"] !== null) {

            console.log("parsedResponse[code] !== undefined : " + test["code"]);

            await that.getAccessToken(test["code"]).then(async (token: AuthResponse) => {

              complete = true;
              browserRef.close();
              console.log("Access token obtained", token.access_token);

              that.currentTokens = token;
              await that.saveTokens(token);

              resolve(token);

            }).catch((error: Error) => {
              console.error("Access code request failed", error);
              browserRef.close();
              reject(error);
            });

          } else if(test["error"] !== undefined && test["error"] !== null){

            console.log("parsedResponse[error] !== undefined  : " + test["error_description"]);
            browserRef.close();

            test["error_description"] = test["error_description"].replace(/\+/g, " ");
            reject(test["error_description"]);

          } else {
            console.error("rejected");
            browserRef.close();
            reject("Problem authenticating with ICBF");
          }
        }
      });

      browserRef.on('exit').subscribe(async (event: InAppBrowserEvent) => {

        that.browserActive = false;
        that.isConnecting = false;

        browserRef.close();

        if(complete) {
          console.log("Exiting inAppBrowser");
          resolve(that.currentTokens);
        } else {
          reject("The ICBF sign in flow was cancelled");
        }
      });
    });
  }

  public getAccessToken(authCode: any): Promise<any> {

    //console.log("Get access token for authorization code " + authCode);
    let that = this;

    let msgData: AccessTokenRequest = {
      "grant_type": "authorization_code",
      "client_id": this.clientId,
      "client_secret": this.secret,
      "code": authCode,
      "redirect_uri": this.redirectUri
    };

    return new Promise(function (resolve, reject) {
      that.http.post(that.authUrl, msgData, {})
        .toPromise()
        .then((res: any) => {
          console.log('getAccessToken', res);
          resolve(res);
        }).catch(errors => {
          console.error("Unsuccessful authRequest (Access token) ", errors)
          reject(errors);
        });
    });

  }

  private getAuthorizationCode(url: any) {

    var key, value;

    var responseParameters = ((url).split("?")[1]).split("&");

    var parsedResponse: any;
    for (var i = 0; i < responseParameters.length; i++) {

      key = responseParameters[i].split("=")[0];
      value = responseParameters[i].split("=")[1];
      parsedResponse[key] = value;

    }

    return parsedResponse;

  }

  private authRequest(msgData: any): Promise<any> {

    return this.http.post(this.authUrl, msgData, {}).toPromise();

  }


  private useRefreshToken(refreshToken: any): Promise<AuthResponse> {

    let that = this;
    var msgData: RefreshTokenRequest = {
      "grant_type": "refresh_token",
      "refresh_token": refreshToken,
      "client_id": this.clientId,
      "client_secret": this.secret
    }

    return new Promise(function (resolve, reject) {

      console.log("Attempt to use refresh token");
      that.authRequest(msgData)
        .then(data => {
          console.log("Successful authRequest, saving Tokens");
          that.saveTokens(data);

          resolve(data);

          console.log("Access token obtained");
        }
        ).catch(errors => {
          console.error("Unsuccessful authRequest (Refresh Token)", errors)
          reject(errors);
        });

    });
  }

  public getTokens(): Promise<AuthResponse> {

    let that = this;

    return new Promise(async function (resolve, reject) {
      // resolve(that.defaultTokens);

        await Preferences.get({ key: 'authHPApp' }).then((data: any) => {
          console.log("Received token from secure storage", data);
          console.log("Received token from secure storage", data);
          console.log(data.access_token);
          resolve(data);

        })
        .catch((error) => {
              console.log(error);
            });

    
    })
  }

  private async saveTokens(data: any) {
    //console.log("savTokens()")


      let request: AuthResponse = {
        access_token: data.access_token,
        expiry_time: moment().add(data.expires_in, 's').format(),
        token_type: data.token_type,
        scope: data.scope,
        refresh_token: data.refresh_token
      };
      //console.log("request", request);

      //console.log("storage creating...");

      await Preferences.set({

        key: 'authHPApp',
        value: JSON.stringify(request)

      }).then(() => console.log('Stored item securely!'),

          error => console.error('Error storing item', error)

      ).catch((error) => {
        console.log(error)
      });

  
  }

  public clearCredentials() {

    var that = this;

    this.clearCurrentToken();


      Preferences.clear().then(
        data => console.log("Cleared secure storage"),
        error => console.error("Failed to clear secure storage", error)
      ).catch(() => {
        
      });


  }

  private clearCurrentToken() {

    for (var property in this.currentTokens) {
      if (this.currentTokens.hasOwnProperty(property)) {
        delete this.currentTokens[property];
      }
    }

  }


  public newIcbfLogin(data: any) {

    let that = this;
    console.log("details", data);
    var username = data.bte.toUpperCase().trim();
    var password = data.password.trim();

    console.log(username);
    console.log(password);

    var msgData={
      "grant_type":     "password",
      "client_id":      this.clientId,
      "client_secret":  this.secret,
      "username" :      username,
      "password" :      password
    }

    console.log(that.authUrl)
    console.log(msgData);

    console.log("Starting log in process");

    return new Promise(function (resolve, reject) {

      that.http.post(that.authUrl, msgData, {}).pipe(map((result) => result)).subscribe(
        (result: any) => {
          console.log(result);

          console.log("Access token obtained", result.access_token);

          that.currentTokens = result;
          that.saveTokens(result);
            
          resolve(result);

        },
        (error: any) => {
          console.log(error);
          reject(error);
        }

      );
    });

  }

}