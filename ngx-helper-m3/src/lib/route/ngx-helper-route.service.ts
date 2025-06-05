import { ApplicationRef, createComponent, EmbeddedViewRef, Injectable, Injector } from '@angular/core';

import { Helper } from '@webilix/helper-library';

import { GetComponent } from './get/get.component';
import { ShowComponent } from './show/show.component';

import { INgxHelperRouteConfig, NgxHelperRoute } from './ngx-helper-route.interface';

@Injectable({ providedIn: 'root' })
export class NgxHelperRouteService {
    constructor(private readonly applicationRef: ApplicationRef, private readonly injector: Injector) {}

    get(): Promise<NgxHelperRoute>;
    get(route: NgxHelperRoute): Promise<NgxHelperRoute>;
    get(config: Partial<INgxHelperRouteConfig>): Promise<NgxHelperRoute>;
    get(route: NgxHelperRoute, config: Partial<INgxHelperRouteConfig>): Promise<NgxHelperRoute>;
    get(arg1?: any, arg2?: any): Promise<NgxHelperRoute> {
        const route: NgxHelperRoute = arg1 && Helper.IS.array(arg1) ? arg1 : [];
        const config: Partial<INgxHelperRouteConfig> | undefined =
            arg2 || (arg1 && !Helper.IS.array(arg1) ? arg1 : undefined);

        return new Promise<NgxHelperRoute>((resolve, reject) => {
            const componentRef = createComponent<GetComponent>(GetComponent, {
                environmentInjector: this.applicationRef.injector,
                elementInjector: this.injector,
            });

            componentRef.instance.route = route;
            componentRef.instance.config = config;
            componentRef.instance.close = (route?: NgxHelperRoute) => {
                this.applicationRef.detachView(componentRef.hostView);
                componentRef.destroy();

                route ? resolve(route) : reject();
            };

            const htmlElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
            this.applicationRef.attachView(componentRef.hostView);
            document.body.appendChild(htmlElement);
        });
    }

    show(route: NgxHelperRoute): void;
    show(route: NgxHelperRoute, config: Partial<Omit<INgxHelperRouteConfig, 'view'>>): void;
    show(route: NgxHelperRoute, config?: Partial<Omit<INgxHelperRouteConfig, 'view'>>): void {
        const componentRef = createComponent<ShowComponent>(ShowComponent, {
            environmentInjector: this.applicationRef.injector,
            elementInjector: this.injector,
        });

        componentRef.instance.route = route;
        componentRef.instance.config = config;
        componentRef.instance.close = () => {
            this.applicationRef.detachView(componentRef.hostView);
            componentRef.destroy();
        };

        const htmlElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        this.applicationRef.attachView(componentRef.hostView);
        document.body.appendChild(htmlElement);
    }
}
