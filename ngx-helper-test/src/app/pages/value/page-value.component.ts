import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { INgxHelperValueBox, NgxHelperValueBoxComponent } from '@webilix/ngx-helper-m3';

@Component({
    host: { selector: 'page-value' },
    imports: [NgxHelperValueBoxComponent],
    templateUrl: './page-value.component.html',
    styleUrl: './page-value.component.scss',
})
export class PageValueComponent implements OnInit {
    public period = { from: new Date(new Date().getTime() - 1000000000), to: new Date(new Date().getTime() + 1000010000) };
    public valueBoxes: INgxHelperValueBox[] = [
        {
            title: 'شماره کارت بانکی',
            value: { type: 'BANK-CARD', value: '5022291000000008', english: true },
            action: () => console.log('CLICK: BANK-CARD'),
        },
        {
            title: 'تاریخ',
            value: { type: 'DATE', value: new Date(), format: 'FULL' },
            action: () => {
                console.log('CLICK: DATE, [RETURN to INDEX]');
                return ['/'];
            },
        },
        { title: 'مدت زمانی', value: { type: 'DURATION' } },
        { title: 'حجم فایل', value: { type: 'FILE-SIZE', value: 1234567, english: true } },
        { title: 'موبایل', value: { type: 'MOBILE', value: '09123456789', join: ' ' } },
        { title: 'عدد', value: { type: 'NUMBER', value: -1234.567890123456789, english: true, fractionDigits: 5 } },
        { title: 'دوره زمانی', value: { type: 'PERIOD', value: this.period } },
        { title: 'قیمت', value: { type: 'PRICE', value: 1234567, currency: 'تومان' } },
        { title: 'حجم', value: { type: 'VOLUME', value: 1234567 } },
        { title: 'وزن', value: { type: 'WEIGHT', value: 1234567 } },
    ];

    constructor(private readonly appService: AppService) {}

    ngOnInit(): void {
        this.appService.setHeader('VALUE');
    }
}
