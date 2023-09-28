import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


// if (environment.production) {
//   console.log('aaaaaaaa')
//   enableProdMode();
//   if(window) {
//     console.log('aaaaaaaa')
//     window.console.log = function() {};
//     window.console.error = function(){}
//   }
// }
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
