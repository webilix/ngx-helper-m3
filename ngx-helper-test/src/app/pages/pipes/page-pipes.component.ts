import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import {
    NgxHelperBankCardPipe,
    NgxHelperDatePipe,
    NgxHelperDurationPipe,
    NgxHelperFileSizePipe,
    NgxHelperMobilePipe,
    NgxHelperMultiLinePipe,
    NgxHelperNumberPipe,
    NgxHelperPeriodPipe,
    NgxHelperPricePipe,
    NgxHelperSafePipe,
    NgxHelperVolumePipe,
    NgxHelperWeightPipe,
} from '@webilix/ngx-helper-m3';

import { AppService } from '../../app.service';

@Component({
    host: { selector: 'page-pipes' },
    imports: [
        NgxHelperBankCardPipe,
        NgxHelperDatePipe,
        NgxHelperDurationPipe,
        NgxHelperFileSizePipe,
        NgxHelperMobilePipe,
        NgxHelperMultiLinePipe,
        NgxHelperNumberPipe,
        NgxHelperPeriodPipe,
        NgxHelperPricePipe,
        NgxHelperSafePipe,
        NgxHelperVolumePipe,
        NgxHelperWeightPipe,
    ],
    templateUrl: './page-pipes.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './page-pipes.component.scss',
})
export class PagePipesComponent implements OnInit {
    public bankCard: string = '5022291000000008';
    public date: Date = new Date();
    public duration: { from: Date; to: Date; second: number } = {
        from: new Date(new Date().getTime() - 7 * 24 * 3600 * 1000),
        to: new Date(new Date().getTime() + 7 * 24 * 3600 * 1000),
        second: 123 * 24 * 3600 + 11 * 3600 + 12 * 60 + 13,
    };
    public mobile: string = '09123456789';
    public multiLine: string =
        'این متن در سه خط نمایش داده می‌شود و خط سوم شامل دستورهای HTML است!' +
        '\n' +
        'خط دوم' +
        '\n' +
        'LINK: <a href="/">LINK</a>';
    public period: { from: Date; to: Date } = {
        from: new Date(new Date().getTime() - 7 * 24 * 3600 * 1000),
        to: new Date(new Date().getTime() + 7 * 24 * 3600 * 1000),
    };
    public safeHTML: string = '<a href="/" >LINK</a>';
    public safeStyle: string = 'font-size: 15px; color: red; padding: 0 1rem; text-shadow: 0 1px 0 #000;';

    public randomDate: Date = new Date(new Date().getTime() - Math.ceil(Math.random() * 7 * 24 * 3600 * 1000));
    public randomFileSize: number = Math.ceil(Math.random() * 123456789);
    public randomPrice: number = Math.ceil(Math.random() * 123456789);
    public randomVolume: number = Math.ceil(Math.random() * 123456789);
    public randomWeight: number = Math.ceil(Math.random() * 123456789);

    constructor(private readonly appService: AppService) {}

    ngOnInit(): void {
        this.appService.setHeader('PIPES');
    }
}
