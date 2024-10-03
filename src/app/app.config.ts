import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideAuth0 } from '@auth0/auth0-angular';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideAuth0({
      domain: 'dev-05goxzwbcxrtn5fz.us.auth0.com',
      clientId: 'O4lBfgDW35tMkQOzS7kJwkvyveKJuy6K',
      authorizationParams: {
        redirect_uri: "http://localhost:4200/login"
      }
    }),
    provideHttpClient()
  ]
};
