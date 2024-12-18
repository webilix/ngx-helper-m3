import { Pipe, PipeTransform } from '@angular/core';

import { Helper } from '@webilix/helper-library';

@Pipe({ name: 'ngxHelperPeriod' })
export class NgxHelperPeriodPipe implements PipeTransform {
    transform(value?: Date | null, options?: { timezone?: string }): string;
    transform(value?: { from: Date } | null, options?: { timezone?: string }): string;
    transform(value?: { to: Date } | null, options?: { timezone?: string }): string;
    transform(value?: { from: Date; to: Date } | null, options?: { timezone?: string }): string;
    transform(value?: any, options?: { timezone?: string }): string {
        if (value === undefined || value === null) return '';

        const from: Date = Helper.IS.date(value) ? value : 'from' in value ? value.from : new Date();
        const to: Date = Helper.IS.date(value) ? new Date() : 'to' in value ? value.to : new Date();

        return Helper.DATE.jalaliPeriod(from, to, options?.timezone || '');
    }
}
