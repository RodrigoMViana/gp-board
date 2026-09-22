import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { routes } from './app.routes';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    // Hash location keeps deep links working on GitHub Pages without a server.
    provideRouter(routes, withHashLocation()),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
};
