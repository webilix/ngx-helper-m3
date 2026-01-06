import { Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { Helper } from '@webilix/helper-library';

import { ImageComponent } from './image/image.component';
import { GalleryComponent } from './gallery/gallery.component';

import { INgxHelperImage, INgxHelperImageConfig } from './ngx-helper-image.interface';

@Injectable({ providedIn: 'root' })
export class NgxHelperImageService {
    constructor(private readonly overlay: Overlay) {}

    showImage(image: INgxHelperImage, config?: INgxHelperImageConfig): void {
        const overlayRef = this.overlay.create({ hasBackdrop: false, direction: 'rtl' });
        const componentRef = overlayRef.attach(new ComponentPortal(ImageComponent));

        componentRef.setInput('image', image);
        componentRef.setInput('config', config);
        componentRef.setInput('close', () => {
            document.body.style.overflow = 'visible';
            overlayRef.dispose();
        });

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

        const overlayRef = this.overlay.create({ hasBackdrop: false, direction: 'rtl' });
        const componentRef = overlayRef.attach(new ComponentPortal(GalleryComponent));

        componentRef.setInput('images', images);
        componentRef.setInput('config', config);
        componentRef.setInput('index', index);
        componentRef.setInput('close', () => {
            document.body.style.overflow = 'visible';
            overlayRef.dispose();
        });

        document.body.style.overflow = 'hidden';
    }
}
