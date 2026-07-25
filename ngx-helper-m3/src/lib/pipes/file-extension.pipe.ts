import { Pipe, PipeTransform } from '@angular/core';

import { Helper } from '@webilix/helper-library';

@Pipe({ name: 'ngxHelperFileExtension' })
export class NgxHelperFileExtensionPipe implements PipeTransform {
    transform(value?: string | null, options?: { case?: 'UPPER' | 'LOWER' }): string {
        if (value === undefined || value === null || !Helper.IS.string(value)) return '';
        if (value.indexOf('.') === -1) return '';

        const index = value.lastIndexOf('.');
        const extension: string = index > 0 ? value.slice(index + 1) : '';

        switch (options?.case) {
            case 'LOWER':
                return extension.toLowerCase();
            case 'UPPER':
                return extension.toUpperCase();
        }

        return extension;
    }
}
