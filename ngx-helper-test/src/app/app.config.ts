import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { provideNgxHelperConfig } from '@webilix/ngx-helper-m3';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes),
        provideHttpClient(withXhr()),

        // NGX-HELPER
        provideNgxHelperConfig({
            mobileWidth: 900,
            pageGroupSidebarWidth: '250px',
            paginationHasShadow: true,
            paginationMargin: '2rem 0 1rem 0',
            toastXPosition: 'RIGHT',
            toastResetDuplicates: true,
            toastProgressAnimation: 'DECREASE',
            stickyView: {
                top: { desktopView: 'calc(95px + 1rem)', mobileView: 'calc(55px + 1rem)' },
                bottom: { desktopView: '1rem', mobileView: 'calc(50px + 1rem)' },
            },
        }),
    ],
};
