import { Component, HostBinding, Input } from '@angular/core';

import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

import { NgxHelperMultiLinePipe } from '../../pipes/multi-line.pipe';

import { INgxHelperImage, INgxHelperImageConfig } from '../ngx-helper-image.interface';

@Component({
    host: { selector: 'image', '(window:keydown)': 'checkEscape($event)' },
    imports: [MatIcon, MatIconButton, NgxHelperMultiLinePipe],
    templateUrl: './image.component.html',
    styleUrl: './image.component.scss',
})
export class ImageComponent {
    @HostBinding('className') protected className: string = 'ngx-helper-m3-image';

    @Input({ required: true }) image!: INgxHelperImage;
    @Input({ required: true }) config?: INgxHelperImageConfig;
    @Input({ required: true }) close!: () => void;

    checkEscape(event: any): void {
        if (!(event instanceof KeyboardEvent)) return;

        if (event.code === 'Escape') {
            event.preventDefault();
            this.close();
        }
    }
}
