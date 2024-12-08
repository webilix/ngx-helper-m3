import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Helper } from '@webilix/helper-library';

@Pipe({ name: 'ngxHelperMultiLine' })
export class NgxHelperMultiLinePipe implements PipeTransform {
    constructor(private readonly sanitizer: DomSanitizer) {}

    transform(value: string, options?: { html?: boolean }): string | SafeHtml {
        if (!Helper.IS.string(value) || value === '') return '';

        return options?.html
            ? this.sanitizer.bypassSecurityTrustHtml(value.replace(/(?:\r\n|\r|\n)/g, '<br />'))
            : Helper.STRING.escapeHTML(value).replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
}
