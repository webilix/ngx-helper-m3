import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';

import { Helper } from '@webilix/helper-library';

type Types = 'HTML' | 'STYLE' | 'SCRIPT' | 'URL' | 'RESOURCE_URL';

@Pipe({ name: 'ngxHelperSafe' })
export class NgxHelperSafePipe implements PipeTransform {
    constructor(private readonly domSanitizer: DomSanitizer) {}

    transform(
        value?: string | null,
        options?: { type?: Types },
    ): string | SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
        if (value === undefined || value === null || !Helper.IS.string(value) || value === '') return '';

        switch (options?.type || 'HTML') {
            case 'STYLE':
                return this.domSanitizer.bypassSecurityTrustStyle(value);
            case 'SCRIPT':
                return this.domSanitizer.bypassSecurityTrustScript(value);
            case 'URL':
                return this.domSanitizer.bypassSecurityTrustUrl(value);
            case 'RESOURCE_URL':
                return this.domSanitizer.bypassSecurityTrustResourceUrl(value);
            case 'HTML':
                return this.domSanitizer.bypassSecurityTrustHtml(value);
        }
    }
}
