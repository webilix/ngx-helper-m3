import { ApplicationRef, createComponent, EmbeddedViewRef, Injectable, Injector } from '@angular/core';

import { GetComponent } from './get/get.component';
import { ShowComponent } from './show/show.component';

import { INgxHelperCoordinates, INgxHelperCoordinatesConfig } from './ngx-helper-coordinates.interface';

@Injectable({ providedIn: 'root' })
export class NgxHelperCoordinatesService {
    constructor(private readonly applicationRef: ApplicationRef, private readonly injector: Injector) {}

    get(): Promise<INgxHelperCoordinates>;
    get(coordinates: INgxHelperCoordinates): Promise<INgxHelperCoordinates>;
    get(config: Partial<INgxHelperCoordinatesConfig>): Promise<INgxHelperCoordinates>;
    get(coordinates: INgxHelperCoordinates, config: Partial<INgxHelperCoordinatesConfig>): Promise<INgxHelperCoordinates>;
    get(arg1?: any, arg2?: any): Promise<INgxHelperCoordinates> {
        const coordinates: INgxHelperCoordinates | undefined = arg1 ? ('latitude' in arg1 ? arg1 : undefined) : undefined;
        const config: Partial<INgxHelperCoordinatesConfig> | undefined = arg2 || (arg1 && !coordinates ? arg1 : undefined);

        return new Promise<INgxHelperCoordinates>((resolve, reject) => {
            const componentRef = createComponent<GetComponent>(GetComponent, {
                environmentInjector: this.applicationRef.injector,
                elementInjector: this.injector,
            });

            componentRef.instance.coordinates = coordinates;
            componentRef.instance.config = config;
            componentRef.instance.close = (coordinates?: INgxHelperCoordinates) => {
                this.applicationRef.detachView(componentRef.hostView);
                componentRef.destroy();

                coordinates ? resolve(coordinates) : reject();
            };

            const htmlElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
            this.applicationRef.attachView(componentRef.hostView);
            document.body.appendChild(htmlElement);
        });
    }

    show(coordinates: INgxHelperCoordinates): void;
    show(coordinates: INgxHelperCoordinates, config: Partial<Omit<INgxHelperCoordinatesConfig, 'view'>>): void;
    show(coordinates: INgxHelperCoordinates, config?: Partial<Omit<INgxHelperCoordinatesConfig, 'view'>>): void {
        const componentRef = createComponent<ShowComponent>(ShowComponent, {
            environmentInjector: this.applicationRef.injector,
            elementInjector: this.injector,
        });

        componentRef.instance.coordinates = coordinates;
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
