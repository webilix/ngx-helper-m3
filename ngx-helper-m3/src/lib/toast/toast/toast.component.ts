import { AfterViewInit, Component, ElementRef, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { MatIcon } from '@angular/material/icon';

import { NgxHelperMultiLinePipe } from '../../pipes/multi-line.pipe';
import { INgxHelperConfig } from '../../ngx-helper.config';

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
export class ToastComponent implements OnInit, OnDestroy, AfterViewInit {
    @HostListener('click') private onClick = () => this.close();

    @HostBinding('@host') protected host: boolean = true;
    @HostBinding('className') protected className: string = 'ngx-helper-m3-toast';
    @HostBinding('style.top') public top: string = '1rem';
    @HostBinding('style.color') public textColor!: string;
    @HostBinding('style.border-color') public borderColor!: string;
    @HostBinding('style.background-color') public backgroundColor!: string;

    public id!: string;
    public icon!: string;
    public messages: string[] = [];
    public config!: { helper?: Partial<INgxHelperConfig>; toast: Partial<INgxHelperToastConfig> };
    public init!: () => void;
    public close!: () => void;

    public timeout!: number;
    public showClose!: boolean;
    public animation!: 'DECREASE' | 'INCREASE';

    public progress: number = 0;
    public start: number = 0;
    private interval?: any;

    constructor(public readonly elementRef: ElementRef) {}

    ngOnInit(): void {
        this.borderColor = this.backgroundColor;

        const xPosition: 'LEFT' | 'CENTER' | 'RIGHT' = this.config.helper?.toastXPosition || 'CENTER';
        this.className = `ngx-helper-m3-toast ${xPosition.toLowerCase()}`;

        const toastTimeout =
            this.config.helper?.toastTimeout === undefined || this.config.helper?.toastTimeout < 0
                ? 4000
                : this.config.helper?.toastTimeout;
        this.timeout =
            this.config.toast.timeout === undefined || this.config.toast.timeout < 0
                ? toastTimeout
                : this.config.toast.timeout;
        this.showClose = this.config.toast.showClose || this.timeout === 0;
        this.animation = this.config.helper?.toastProgressAnimation || 'DECREASE';

        if (this.timeout) {
            this.start = new Date().getTime();
            this.interval = setInterval(() => {
                const timer: number = new Date().getTime();
                this.progress = ((timer - this.start) * 100) / this.timeout;
                this.progress = this.progress < 100 ? +this.progress.toFixed(2) : 100;
                if (this.progress === 100) this.close();
            }, 25);
        }
    }

    ngOnDestroy(): void {
        if (this.interval) clearInterval(this.interval);
    }

    ngAfterViewInit(): void {
        this.init();
    }
}
