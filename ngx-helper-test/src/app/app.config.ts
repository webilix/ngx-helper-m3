import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { provideNgxHelperConfig } from '@webilix/ngx-helper-m3';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimationsAsync(),

        // NGX-HELPER
        provideNgxHelperConfig({
            mobileWidth: 900,
            sidebarWidth: '250px',
            stickyView: {
                top: { desktopView: 'calc(95px + 1rem)', mobileView: 'calc(55px + 1rem)' },
                bottom: { desktopView: '1rem', mobileView: 'calc(50px + 1rem)' },
            },
        }),
    ],
};
