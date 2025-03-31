import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatButton } from '@angular/material/button';

import { JalaliDateTime } from '@webilix/jalali-date-time';
import {
    NgxHelperDatePipe,
    NgxHelperProgressComponent,
    NgxHelperSectionColumnComponent,
    NgxHelperSectionComponent,
} from '@webilix/ngx-helper-m3';

import { AppService } from '../../app.service';

import { PageProgressContentComponent } from './content/page-progress-content.component';

@Component({
    host: { selector: 'page-progress' },
    imports: [
        MatButton,
        NgxHelperProgressComponent,
        NgxHelperSectionComponent,
        NgxHelperSectionColumnComponent,
        NgxHelperDatePipe,
        PageProgressContentComponent,
    ],
    templateUrl: './page-progress.component.html',
    styleUrl: './page-progress.component.scss',
})
export class PageProgressComponent implements OnInit, OnDestroy {
    public borderRadius: string = '16px';
    public progress: number = 50;
    public isRandom: boolean = false;

    public date: Date = new Date();
    public dateProgress!: { done: number; total: number };

    private jalali = JalaliDateTime();
    private randomInterval!: any;

    constructor(private readonly appService: AppService) {}

    ngOnInit(): void {
        this.appService.setHeader('PROGESS');

        this.updateDate();
        this.randomInterval = setInterval(() => {
            this.updateDate();

            if (!this.isRandom) return;
            this.progress = Math.ceil(Math.random() * 10) * 10;
        }, 1000);
    }

    ngOnDestroy(): void {
        if (this.randomInterval) clearInterval(this.randomInterval);
    }

    updateDate(): void {
        this.date = new Date();
        const start: number = this.jalali.periodDay(1, this.date).from.getTime();
        const current: number = this.date.getTime();
        this.dateProgress = { done: current - start, total: 24 * 3600 * 1000 };
    }
}
