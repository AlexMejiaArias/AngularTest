import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ToastComponent } from '../shared/components/Toast/Toast.component';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), ToastComponent],

};
