import { Component, HostBinding } from '@angular/core';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    host: { selector: 'pdf', '(window:keydown)': 'checkEscape($event)' },
    imports: [MatIcon, MatIconButton, NgxExtendedPdfViewerModule],
    templateUrl: './pdf.component.html',
    styleUrl: './pdf.component.scss',
})
export class PdfComponent {
    @HostBinding('className') protected className: string = 'ngx-helper-m3-pdf';

    public src!: Blob;
    public close!: () => void;

    checkEscape(event: any): void {
        if (!(event instanceof KeyboardEvent)) return;

        if (event.code === 'Escape') {
            event.preventDefault();
            this.close();
        }
    }
}
