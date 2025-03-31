import { Pipe, PipeTransform } from '@angular/core';

import { Helper } from '@webilix/helper-library';

@Pipe({ name: 'ngxHelperFileSize' })
export class NgxHelperFileSizePipe implements PipeTransform {
    transform(value?: number | null, options?: { english?: boolean }): string {
        if (value === undefined || value === null || !Helper.IS.number(value)) return '';

        return Helper.NUMBER.toFileSize(value, !!options?.english ? 'EN' : 'FA');
    }
}
