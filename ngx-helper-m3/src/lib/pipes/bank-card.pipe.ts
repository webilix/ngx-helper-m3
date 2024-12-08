import { Pipe, PipeTransform } from '@angular/core';

import { Helper } from '@webilix/helper-library';

@Pipe({ name: 'ngxHelperBankCard' })
export class NgxHelperBankCardPipe implements PipeTransform {
    transform(value: string, options?: { view?: 'CARD' | 'BANK'; join?: string }): string {
        if (!Helper.IS.string(value) || value === '') return '';

        switch (options?.view) {
            case 'BANK':
                return Helper.BANK.findCard(value)?.title || '';
            default:
                return Helper.STRING.getBankCardView(value, options?.join || '-');
        }
    }
}
