import { Pipe, PipeTransform } from '@angular/core';

import { Helper } from '@webilix/helper-library';

import { DurationFormats } from '../pipe.types';

@Pipe({ name: 'ngxHelperDuration' })
export class NgxHelperDurationPipe implements PipeTransform {
    transform(value?: number | null, options?: { format?: DurationFormats; english?: boolean }): string;
    transform(value?: Date | null, options?: { format?: DurationFormats; english?: boolean }): string;
    transform(value?: { from: Date } | null, options?: { format?: DurationFormats; english?: boolean }): string;
    transform(value?: { to: Date } | null, options?: { format?: DurationFormats; english?: boolean }): string;
    transform(value?: { from: Date; to: Date } | null, options?: { format?: DurationFormats; english?: boolean }): string;
    transform(value?: any, options?: { format?: DurationFormats; english?: boolean }): string {
        if (value === undefined || value === null) return '';

        let seconds: number = 0;
        if (Helper.IS.number(value)) seconds = Math.abs(value);
        else if (Helper.IS.date(value)) seconds = Math.floor(Math.abs(new Date().getTime() - value.getTime()) / 1000);
        else if (Helper.IS.object(value)) {
            const from: Date = 'from' in value ? value.from : new Date();
            const to: Date = 'to' in value ? value.to : new Date();
            seconds = Math.floor(Math.abs(from.getTime() - to.getTime()) / 1000);
        }

        const days: number = Math.floor(seconds / (24 * 60 * 60));
        seconds -= days * (24 * 60 * 60);
        const hours: number = Math.floor(seconds / (60 * 60));
        seconds -= hours * (60 * 60);
        const minutes: number = Math.floor(seconds / 60);
        seconds -= minutes * 60;

        const hasDays: boolean = days !== 0;
        const time: string = [hours, minutes, seconds].map((v) => v.toString().padStart(2, '0')).join(':');

        switch (options?.format || 'TEXT') {
            case 'TEXT':
                const hasTime: boolean = !!hours || !!minutes || !!seconds;
                const day: string = hasDays
                    ? Helper.NUMBER.format(days, 'EN') + (!!options?.english ? (days === 1 ? ' day' : ' days') : ' روز')
                    : '';
                const join = hasDays && hasTime ? (!!options?.english ? ', ' : ' و ') : '';
                return (day + join + (!hasDays || hasTime ? time : '')).trim();

            case 'FULL':
                return (hasDays ? Helper.NUMBER.format(days, 'EN') + ':' : '') + time;

            case 'DAY':
                return Helper.NUMBER.format(days + (hours !== 0 || minutes !== 0 ? 1 : 0), !!options?.english ? 'EN' : 'FA');

            case 'HOUR':
                return Helper.NUMBER.format(days * 24 + hours + (minutes !== 0 ? 1 : 0), !!options?.english ? 'EN' : 'FA');

            case 'MINUTE':
                return Helper.NUMBER.format(days * 24 * 60 + hours * 60 + minutes, !!options?.english ? 'EN' : 'FA');

            case 'SECOND':
                return Helper.NUMBER.format(
                    days * 24 * 3600 + hours * 3600 + minutes * 60 + seconds,
                    !!options?.english ? 'EN' : 'FA',
                );
        }
    }
}
