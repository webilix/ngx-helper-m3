import { Pipe, PipeTransform } from '@angular/core';

import { Helper } from '@webilix/helper-library';

@Pipe({ name: 'ngxHelperMobile' })
export class NgxHelperMobilePipe implements PipeTransform {
    transform(value?: string | null, options?: { join?: string }): string {
        if (value === undefined || value === null || !Helper.IS.string(value) || value === '') return '';

        return Helper.STRING.getMobileView(value, options?.join || '-');
    }
}
