import { Pipe, PipeTransform } from '@angular/core';
import { parse } from 'tldts';

import { Helper } from '@webilix/helper-library';

@Pipe({ name: 'ngxHelperDomain' })
export class NgxHelperDomainPipe implements PipeTransform {
    transform(value?: string | null, options?: { format?: 'DOMAIN' | 'SUB' | 'SUBDOMAIN' }): string {
        if (value === undefined || value === null || !Helper.IS.string(value)) return '';

        try {
            const url = parse(value);
            switch (options?.format) {
                case 'DOMAIN':
                    return url.domain ?? '';
                case 'SUB':
                case 'SUBDOMAIN':
                    return url.subdomain ?? url.domain ?? '';
                default:
                    return url.hostname ?? '';
            }
        } catch (e) {
            return '';
        }
    }
}
