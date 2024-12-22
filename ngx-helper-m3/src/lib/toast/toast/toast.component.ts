import { Component, ElementRef, HostBinding, HostListener, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { MatIcon } from '@angular/material/icon';

import { NgxHelperMultiLinePipe } from '../../pipes/multi-line.pipe';
import { INgxHelperConfig, NGX_HELPER_CONFIG } from '../../ngx-helper.config';

import { INgxHelperToastConfig } from '../ngx-helper-toast.interface';

@Component({
    host: { selector: 'toast' },
    imports: [MatIcon, NgxHelperMultiLinePipe],
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.scss',
    animations: [
        trigger('host', [
            transition(':enter', [
                style({ top: 0, opacity: 0 }),
                animate('350ms ease-in-out', style({ top: '*', opacity: 1 })),
            ]),
        ]),
    ],
})
export class ToastComponent implements OnInit, OnDestroy {
    @HostListener('click') private onClick = () => this.close();

    @HostBinding('@host') private host: boolean = true;
    @HostBinding('className') private className: string = 'ngx-helper-m3-toast';
    @HostBinding('style.top') top: string = '1rem';
    @HostBinding('style.color') textColor!: string;
    @HostBinding('style.border-color') borderColor!: string;
    @HostBinding('style.background-color') backgroundColor!: string;

    public id!: string;
    public icon!: string;
    public messages: string[] = [];
    public config!: Partial<INgxHelperToastConfig>;
    public close!: () => void;

    public progress: number = 0;
    private start: number = 0;
    private interval?: any;

    constructor(
        public readonly elementRef: ElementRef,
        @Optional() @Inject(NGX_HELPER_CONFIG) private readonly ngxHelperconfig?: Partial<INgxHelperConfig>,
    ) {}

    ngOnInit(): void {
        this.borderColor = this.backgroundColor;

        const xPosition: 'LEFT' | 'CENTER' | 'RIGHT' = this.ngxHelperconfig?.toastXPosition || 'CENTER';
        this.className = `ngx-helper-m3-toast ${xPosition.toLowerCase()}`;

        const toastTimeout =
            this.ngxHelperconfig?.toastTimeout === undefined || this.ngxHelperconfig?.toastTimeout < 0
                ? 4000
                : this.ngxHelperconfig?.toastTimeout;
        const timeout = this.config.timeout === undefined || this.config.timeout < 0 ? toastTimeout : this.config.timeout;

        if (timeout) {
            this.start = new Date().getTime();
            this.interval = setInterval(() => {
                const timer: number = new Date().getTime();
                this.progress = ((timer - this.start) * 100) / timeout;
                this.progress = this.progress < 100 ? +this.progress.toFixed(2) : 100;
                if (this.progress === 100) this.close();
            }, 25);
        }
    }

    ngOnDestroy(): void {
        if (this.interval) clearInterval(this.interval);
    }
}
