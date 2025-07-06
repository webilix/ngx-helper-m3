import { Component, HostBinding } from '@angular/core';

import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

import { NgxHelperMultiLinePipe } from '../../pipes/multi-line.pipe';

import { INgxHelperImage, INgxHelperImageConfig } from '../ngx-helper-image.interface';

@Component({
    host: { selector: 'gallery', '(window:keydown)': 'checkKey($event)' },
    imports: [MatIcon, MatIconButton, NgxHelperMultiLinePipe],
    templateUrl: './gallery.component.html',
    styleUrl: './gallery.component.scss',
})
export class GalleryComponent {
    @HostBinding('className') private className: string = 'ngx-helper-m3-image';

    public images!: INgxHelperImage[];
    public config?: INgxHelperImageConfig;
    public close!: () => void;

    public index: number = 0;

    checkKey(event: any): void {
        if (!(event instanceof KeyboardEvent)) return;

        if (event.code === 'Escape') {
            event.preventDefault();
            this.close();
        }

        if (event.code === 'ArrowRight') {
            event.preventDefault();
            this.changeIndex(-1);
        }

        if (event.code === 'ArrowLeft') {
            event.preventDefault();
            this.changeIndex(1);
        }
    }

    changeIndex(change: number): void {
        this.index += change;
        if (this.index < 0) this.index = this.images.length - 1;
        if (this.index >= this.images.length) this.index = 0;
    }
}
