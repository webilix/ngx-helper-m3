import { ApplicationRef, createComponent, EmbeddedViewRef, Injectable, Injector } from '@angular/core';

import { Helper } from '@webilix/helper-library';

import { ImageComponent } from './image/image.component';
import { GalleryComponent } from './gallery/gallery.component';

import { INgxHelperImage, INgxHelperImageConfig } from './ngx-helper-image.interface';

@Injectable({ providedIn: 'root' })
export class NgxHelperImageService {
    constructor(private readonly applicationRef: ApplicationRef, private readonly injector: Injector) {}

    showImage(image: INgxHelperImage, config?: INgxHelperImageConfig): void {
        const componentRef = createComponent<ImageComponent>(ImageComponent, {
            environmentInjector: this.applicationRef.injector,
            elementInjector: this.injector,
        });

        componentRef.instance.image = image;
        componentRef.instance.config = config;
        componentRef.instance.close = () => {
            this.applicationRef.detachView(componentRef.hostView);
            componentRef.destroy();
            document.body.style.overflow = 'visible';
        };

        const htmlElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        this.applicationRef.attachView(componentRef.hostView);
        document.body.appendChild(htmlElement);
        document.body.style.overflow = 'hidden';
    }

    showGallery(images: INgxHelperImage[]): void;
    showGallery(images: INgxHelperImage[], index: number): void;
    showGallery(images: INgxHelperImage[], config: INgxHelperImageConfig): void;
    showGallery(images: INgxHelperImage[], index: number, config: INgxHelperImageConfig): void;
    showGallery(images: INgxHelperImage[], arg1?: any, arg2?: any): void {
        if (images.length === 0) return;

        const index: number = Helper.IS.number(arg1) && !!images[arg1] ? arg1 : 0;
        const config: INgxHelperImageConfig | undefined = arg2 || (Helper.IS.object(arg1) ? arg1 : undefined);

        if (images.length === 1) {
            this.showImage(images[0], config);
            return;
        }

        const componentRef = createComponent<GalleryComponent>(GalleryComponent, {
            environmentInjector: this.applicationRef.injector,
            elementInjector: this.injector,
        });

        componentRef.instance.images = images;
        componentRef.instance.config = config;
        componentRef.instance.index = index;
        componentRef.instance.close = () => {
            this.applicationRef.detachView(componentRef.hostView);
            componentRef.destroy();
            document.body.style.overflow = 'visible';
        };

        const htmlElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        this.applicationRef.attachView(componentRef.hostView);
        document.body.appendChild(htmlElement);
        document.body.style.overflow = 'hidden';
    }
}
