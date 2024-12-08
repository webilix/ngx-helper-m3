import { Pipe, PipeTransform } from '@angular/core';

import { Helper } from '@webilix/helper-library';

@Pipe({ name: 'ngxHelperVolume' })
export class NgxHelperVolumePipe implements PipeTransform {
    transform(value: number, options?: { short?: boolean; english?: boolean }): string {
        if (!Helper.IS.number(value) || value < 0) return '';

        const getVolume = (...titles: [string, string][]): string => {
            const volume: string = Helper.NUMBER.format(+value.toFixed(2), options?.english ? 'EN' : 'FA');
            const shortIndex: number = options?.short ? 0 : 1;
            const titleIndex: number = options?.english ? 0 : 1;
            return `${volume} ${titles[shortIndex][titleIndex]}`;
        };

        if (value === 0) return getVolume(['', ''], ['', '']);

        if (value < 1000) return getVolume(['ML', 'م'], ['Milliliter', 'میلی لیتر']);

        value /= 1000;
        return getVolume(['L', 'ل'], ['Liter', 'لیتر']);
    }
}
