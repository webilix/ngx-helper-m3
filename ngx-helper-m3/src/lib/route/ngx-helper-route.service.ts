import { Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { Helper } from '@webilix/helper-library';

import { GetComponent } from './get/get.component';
import { ShowComponent } from './show/show.component';

import { INgxHelperRouteConfig, NgxHelperRoute } from './ngx-helper-route.interface';

@Injectable({ providedIn: 'root' })
export class NgxHelperRouteService {
    constructor(private readonly overlay: Overlay) {}

    get(): Promise<NgxHelperRoute>;
    get(route: NgxHelperRoute): Promise<NgxHelperRoute>;
    get(config: Partial<INgxHelperRouteConfig>): Promise<NgxHelperRoute>;
    get(route: NgxHelperRoute, config: Partial<INgxHelperRouteConfig>): Promise<NgxHelperRoute>;
    get(arg1?: any, arg2?: any): Promise<NgxHelperRoute> {
        const route: NgxHelperRoute = arg1 && Helper.IS.array(arg1) ? arg1 : [];
        const config: Partial<INgxHelperRouteConfig> | undefined =
            arg2 || (arg1 && !Helper.IS.array(arg1) ? arg1 : undefined);

        return new Promise<NgxHelperRoute>((resolve, reject) => {
            const overlayRef = this.overlay.create({ hasBackdrop: false, direction: 'rtl' });
            const componentRef = overlayRef.attach(new ComponentPortal(GetComponent));

            componentRef.setInput('route', route);
            componentRef.setInput('config', config);
            componentRef.setInput('close', (route?: NgxHelperRoute) => {
                route ? resolve(route) : reject();
                overlayRef.dispose();
            });
        });
    }

    show(route: NgxHelperRoute): void;
    show(route: NgxHelperRoute, config: Partial<Omit<INgxHelperRouteConfig, 'view'>>): void;
    show(route: NgxHelperRoute, config?: Partial<Omit<INgxHelperRouteConfig, 'view'>>): void {
        const overlayRef = this.overlay.create({ hasBackdrop: false, direction: 'rtl' });
        const componentRef = overlayRef.attach(new ComponentPortal(ShowComponent));

        componentRef.setInput('route', route);
        componentRef.setInput('config', config);
        componentRef.setInput('close', () => overlayRef.dispose());
    }
}
