import { Component, HostBinding, Input } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    host: { selector: 'pdf', '(window:keydown)': 'checkEscape($event)' },
    imports: [MatIcon, MatIconButton, PdfViewerModule],
    templateUrl: './pdf.component.html',
    styleUrl: './pdf.component.scss',
})
export class PdfComponent {
    @HostBinding('className') protected className: string = 'ngx-helper-m3-pdf';

    @Input({ required: true }) src!: string;
    @Input({ required: true }) close!: () => void;

    checkEscape(event: any): void {
        if (!(event instanceof KeyboardEvent)) return;

        if (event.code === 'Escape') {
            event.preventDefault();
            this.close();
        }
    }
}
