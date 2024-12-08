import { Pipe, PipeTransform } from '@angular/core';

import { Helper } from '@webilix/helper-library';
import { JalaliDateTime } from '@webilix/jalali-date-time';

type Formats = string | 'FULL' | 'SHORT' | 'DATE' | 'TIME' | 'WEEK' | 'MONTH' | 'YEAR';

@Pipe({ name: 'ngxHelperDate' })
export class NgxHelperDatePipe implements PipeTransform {
    transform(value: Date, options?: { format?: Formats; timezone?: string }): string;
    transform(value: number, options?: { format?: Formats; timezone?: string }): string;
    transform(value: any, options?: { format?: Formats; timezone?: string }): string {
        if (!value || (!Helper.IS.date(value) && !Helper.IS.number(value))) return '';

        const date: Date = typeof value === 'number' ? new Date(value) : value;
        const jalali = JalaliDateTime();
        const timezone: string =
            options?.timezone && jalali.timezones().includes(options?.timezone) ? options?.timezone : 'Asia/Tehran';

        switch (options?.format || 'DATE') {
            case 'FULL':
                return jalali.toFullText(date, { format: 'W، d N Y H:I', timezone });

            case 'SHORT':
                return jalali.toFullText(date, { format: 'Y/M/D', timezone });

            case 'DATE':
                return jalali.toFullText(date, { format: 'W، d N Y', timezone });

            case 'TIME':
                return jalali.toFullText(date, { format: 'H:I', timezone });

            case 'WEEK':
                const { from, to } = jalali.periodWeek(1, date, timezone);
                return Helper.DATE.jalaliPeriod(from, to, timezone);

            case 'MONTH':
                return jalali.toFullText(date, { format: 'N Y', timezone });

            case 'YEAR':
                return jalali.toFullText(date, { format: 'Y', timezone });

            default:
                return jalali.toFullText(date, { format: options?.format, timezone });
        }
    }
}
