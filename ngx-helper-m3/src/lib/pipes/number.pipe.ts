import { Pipe, PipeTransform } from '@angular/core';

import { Helper } from '@webilix/helper-library';

@Pipe({ name: 'ngxHelperNumber' })
export class NgxHelperNumberPipe implements PipeTransform {
    transform(value: number, options?: { fractionDigits?: number; english?: boolean }): string {
        if (!Helper.IS.number(value)) return '';

        value = options?.fractionDigits ? +value.toFixed(options?.fractionDigits) : value;
        return Helper.NUMBER.format(value, options?.english ? 'EN' : 'FA');
    }
}
