import { Pipe, PipeTransform } from '@angular/core';

import { Helper } from '@webilix/helper-library';
import { JalaliDateTime } from '@webilix/jalali-date-time';

@Pipe({ name: 'ngxHelperDay' })
export class NgxHelperDayPipe implements PipeTransform {
    transform(value?: string | null): string;
    transform(value?: Date | null, options?: { timezone?: string }): string;
    transform(value?: any, options?: { timezone?: string }): string {
        if (value === undefined || value === null || (!Helper.IS.date(value) && !Helper.IS.STRING.day(value))) return '';

        // STRING VALUE
        if (Helper.IS.STRING.day(value)) return Helper.DAY.toTitle(value);

        // DATE VALUE
        if (Helper.IS.date(value)) {
            const jalali = JalaliDateTime();
            const timezone: string =
                options?.timezone && jalali.timezones().includes(options?.timezone) ? options?.timezone : 'Asia/Tehran';

            return jalali.toFullText(value, { format: 'd N', timezone });
        }

        return '';
    }
}
