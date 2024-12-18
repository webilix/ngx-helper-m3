import { Component, OnInit } from '@angular/core';

import { INgxHelperValue, NgxHelperValueBoxComponent } from '@webilix/ngx-helper-m3';

import { AppService } from '../../app.service';

@Component({
    host: { selector: 'page-value' },
    imports: [NgxHelperValueBoxComponent],
    templateUrl: './page-value.component.html',
    styleUrl: './page-value.component.scss',
})
export class PageValueComponent implements OnInit {
    public period = { from: new Date(new Date().getTime() - 1000000000), to: new Date(new Date().getTime() + 1000010000) };
    public values: INgxHelperValue[] = [
        {
            title: 'شماره کارت بانکی',
            value: { type: 'BANK-CARD', value: '5022291000000008', english: true },
            action: () => console.log('CLICK: BANK-CARD'),
            copyToClipboard: true,
        },
        {
            title: 'تاریخ',
            value: { type: 'DATE', value: new Date(), format: 'FULL' },
            action: () => {
                console.log('CLICK: DATE, [RETURN to INDEX]');
                return ['/'];
            },
        },
        { title: 'مدت زمانی', value: { type: 'DURATION' }, copyToClipboard: true },
        { title: 'حجم فایل', value: { type: 'FILE-SIZE', value: 1234567, english: true } },
        { title: 'موبایل', value: { type: 'MOBILE', value: '09123456789', join: ' ' }, copyToClipboard: true },
        { title: 'عدد', value: { type: 'NUMBER', value: -1234.567890123456789, english: true, fractionDigits: 5 } },
        { title: 'دوره زمانی', value: { type: 'PERIOD', value: this.period } },
        { title: 'قیمت', value: { type: 'PRICE', value: 1234567, currency: 'تومان' }, copyToClipboard: true },
        { title: 'حجم', value: { type: 'VOLUME', value: 1234567 } },
        { title: 'وزن', value: { type: 'WEIGHT', value: 1234567 } },
    ];

    constructor(private readonly appService: AppService) {}

    ngOnInit(): void {
        this.appService.setHeader('VALUE');
    }
}
