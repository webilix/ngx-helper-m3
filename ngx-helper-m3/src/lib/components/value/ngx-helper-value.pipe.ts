import { Pipe, PipeTransform } from '@angular/core';

import { Helper } from '@webilix/helper-library';

import { NgxHelperBankCardPipe } from '../../pipes/bank-card.pipe';
import { NgxHelperDatePipe } from '../../pipes/date.pipe';
import { NgxHelperDurationPipe } from '../../pipes/duration.pipe';
import { NgxHelperFileSizePipe } from '../../pipes/file-size.pipe';
import { NgxHelperMobilePipe } from '../../pipes/mobile.pipe';
import { NgxHelperNumberPipe } from '../../pipes/number.pipe';
import { NgxHelperPeriodPipe } from '../../pipes/period.pipe';
import { NgxHelperPricePipe } from '../../pipes/price.pipe';
import { NgxHelperVolumePipe } from '../../pipes/volume.pipe';
import { NgxHelperWeightPipe } from '../../pipes/weight.pipe';

import { NgxHelperValue } from './ngx-helper-value.interface';

@Pipe({ name: 'ngxHelperValue' })
export class NgxHelperValuePipe implements PipeTransform {
    transform(value?: NgxHelperValue, options?: { emptyText?: string }): string {
        const emptyText = options?.emptyText || '';
        if (value === undefined || Helper.IS.empty(value)) return emptyText;

        switch (value.type) {
            case 'BANK-CARD':
                return new NgxHelperBankCardPipe().transform(value.value, value) || emptyText;

            case 'DATE':
                return new NgxHelperDatePipe().transform(value.value as any, value) || emptyText;

            case 'DURATION':
                return new NgxHelperDurationPipe().transform(value.value as any, value) || emptyText;

            case 'FILE-SIZE':
                return new NgxHelperFileSizePipe().transform(value.value as any, value) || emptyText;

            case 'MOBILE':
                return new NgxHelperMobilePipe().transform(value.value as any, value) || emptyText;

            case 'NUMBER':
                return new NgxHelperNumberPipe().transform(value.value as any, value) || emptyText;

            case 'PERIOD':
                return new NgxHelperPeriodPipe().transform(value.value as any, value) || emptyText;

            case 'PRICE':
                return new NgxHelperPricePipe().transform(value.value as any, value) || emptyText;

            case 'STRING':
                return Helper.IS.string(value.value) ? (value.value as any) : emptyText;

            case 'VOLUME':
                return new NgxHelperVolumePipe().transform(value.value as any, value) || emptyText;

            case 'WEIGHT':
                return new NgxHelperWeightPipe().transform(value.value as any, value) || emptyText;
        }
    }
}
