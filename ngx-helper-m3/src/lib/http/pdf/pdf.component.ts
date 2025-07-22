import { Component, HostBinding } from '@angular/core';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
    host: { selector: 'pdf', '(window:keydown)': 'checkEscape($event)' },
    imports: [MatIcon, MatIconButton, PdfViewerModule],
    templateUrl: './pdf.component.html',
    styleUrl: './pdf.component.scss',
})
export class PdfComponent {
    @HostBinding('className') private className: string = 'ngx-helper-m3-pdf';

    public uint8Array!: Uint8Array;
    public close!: () => void;

    checkEscape(event: any): void {
        if (!(event instanceof KeyboardEvent)) return;

        if (event.code === 'Escape') {
            event.preventDefault();
            this.close();
        }
    }
}
