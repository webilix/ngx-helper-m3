import { ApplicationRef, createComponent, EmbeddedViewRef, Injectable, Injector } from '@angular/core';

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

    showGallery(images: INgxHelperImage[], config?: INgxHelperImageConfig): void {
        if (images.length === 0) return;

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
