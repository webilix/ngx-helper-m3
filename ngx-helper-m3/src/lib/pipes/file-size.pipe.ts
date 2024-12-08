import { Pipe, PipeTransform } from '@angular/core';

import { Helper } from '@webilix/helper-library';

@Pipe({ name: 'ngxHelperFileSize' })
export class NgxHelperFileSizePipe implements PipeTransform {
    transform(size: number, options?: { english?: boolean }): string {
        return Helper.NUMBER.toFileSize(size, !!options?.english ? 'EN' : 'FA');
    }
}
