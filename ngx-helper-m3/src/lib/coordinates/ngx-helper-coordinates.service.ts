import { Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { GetComponent } from './get/get.component';
import { ShowComponent } from './show/show.component';

import { INgxHelperCoordinates, INgxHelperCoordinatesConfig } from './ngx-helper-coordinates.interface';

@Injectable({ providedIn: 'root' })
export class NgxHelperCoordinatesService {
    constructor(private readonly overlay: Overlay) {}

    get(): Promise<INgxHelperCoordinates>;
    get(coordinates: INgxHelperCoordinates): Promise<INgxHelperCoordinates>;
    get(config: Partial<INgxHelperCoordinatesConfig>): Promise<INgxHelperCoordinates>;
    get(coordinates: INgxHelperCoordinates, config: Partial<INgxHelperCoordinatesConfig>): Promise<INgxHelperCoordinates>;
    get(arg1?: any, arg2?: any): Promise<INgxHelperCoordinates> {
        const coordinates: INgxHelperCoordinates | undefined = arg1 ? ('latitude' in arg1 ? arg1 : undefined) : undefined;
        const config: Partial<INgxHelperCoordinatesConfig> | undefined = arg2 || (arg1 && !coordinates ? arg1 : undefined);

        return new Promise<INgxHelperCoordinates>((resolve, reject) => {
            const overlayRef = this.overlay.create({ hasBackdrop: false, direction: 'rtl' });
            const componentRef = overlayRef.attach(new ComponentPortal(GetComponent));

            componentRef.setInput('coordinates', coordinates);
            componentRef.setInput('config', config);
            componentRef.setInput('close', (coordinates?: INgxHelperCoordinates) => {
                coordinates ? resolve(coordinates) : reject();
                overlayRef.dispose();
            });
        });
    }

    show(coordinates: INgxHelperCoordinates): void;
    show(coordinates: INgxHelperCoordinates, config: Partial<Omit<INgxHelperCoordinatesConfig, 'view'>>): void;
    show(coordinates: INgxHelperCoordinates, config?: Partial<Omit<INgxHelperCoordinatesConfig, 'view'>>): void {
        const overlayRef = this.overlay.create({ hasBackdrop: false, direction: 'rtl' });
        const componentRef = overlayRef.attach(new ComponentPortal(ShowComponent));

        componentRef.setInput('coordinates', coordinates);
        componentRef.setInput('config', config);
        componentRef.setInput('close', () => overlayRef.dispose());
    }
}
