import { Pipe, PipeTransform } from '@angular/core';

import { Helper } from '@webilix/helper-library';

@Pipe({ name: 'ngxHelperPrice' })
export class NgxHelperPricePipe implements PipeTransform {
    transform(value: number, options?: { currency?: string; short?: boolean; english?: boolean }): string {
        if (!Helper.IS.number(value) || value < 0) return '';

        const getPrice = (...titles: [string, string][]): string => {
            const price: string = Helper.NUMBER.format(+value.toFixed(2), !!options?.english ? 'EN' : 'FA');
            const unit: string = titles[options?.short ? 0 : 1][options?.english ? 0 : 1];
            const currency: string = options?.currency ? ' ' + options?.currency : '';

            return `${price} ${unit}${currency}`;
        };

        if (value < 1000) return getPrice(['', ''], ['', '']);

        value /= 1000;
        if (value < 1000) return getPrice(['T', 'ه'], ['Thousand', 'هزار']);

        value /= 1000;
        if (value < 1000) return getPrice(['M', 'م'], ['Million', 'میلیون']);

        value /= 1000;
        return getPrice(['B', 'د'], ['Billion', 'میلیارد']);
    }
}
