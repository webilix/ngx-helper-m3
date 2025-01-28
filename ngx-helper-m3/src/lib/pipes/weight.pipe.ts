import { Pipe, PipeTransform } from '@angular/core';

import { Helper } from '@webilix/helper-library';

@Pipe({ name: 'ngxHelperWeight' })
export class NgxHelperWeightPipe implements PipeTransform {
    transform(value?: number | null, options?: { short?: boolean; english?: boolean }): string {
        if (value === undefined || value === null || !Helper.IS.number(value) || value < 0) return '';

        const getWeight = (...titles: [string, string][]): string => {
            if (value === undefined || value === null) return '';

            const weight: string = Helper.NUMBER.format(+value.toFixed(2), options?.english ? 'EN' : 'FA');
            const shortIndex: number = options?.short ? 0 : 1;
            const titleIndex: number = options?.english ? 0 : 1;
            return `${weight} ${titles[shortIndex][titleIndex]}`;
        };

        if (value === 0) return getWeight(['', ''], ['', '']);

        if (value < 1000) return getWeight(['G', 'گ'], ['Gram', 'گرم']);

        value /= 1000;
        if (value < 1000) return getWeight(['K', 'ک'], ['Kilogram', 'کیلو']);

        value /= 1000;
        if (value < 1000) return getWeight(['T', 'ت'], ['Tonne', 'تن']);

        value /= 1000;
        if (value < 1000) return getWeight(['KT', 'ه'], ['Kilotonne', 'هزار تن']);

        value /= 1000;
        return getWeight(['MT', 'م'], ['Milliontonne', 'میلیون تن']);
    }
}
