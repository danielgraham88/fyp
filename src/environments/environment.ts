// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://api.jsu.dev-icbf.com/Api/public',
  authUrl: 'http://api.dev-icbf.com/oauth',
  clientId: 'icbf_gen_defects_app',
  secret: '398rh0f09283209hf',
  redirectUri: "https://api.icbf.com/client/callback"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
