import {
    AfterViewInit,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    WritableSignal,
    signal,
    effect,
    inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { NgxHelperMultiLinePipe } from '../../pipes/multi-line.pipe';
import { INgxHelperConfig } from '../../ngx-helper.config';

import { INgxHelperToastConfig } from '../ngx-helper-toast.interface';

interface IButton {
    readonly icon: string;
    readonly title: string;
    readonly action: string[] | (() => void) | (() => string[]);
}

@Component({
    host: { selector: 'toast' },
    imports: [MatButton, MatIcon, NgxHelperMultiLinePipe],
    templateUrl: './toast.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './toast.component.scss',
})
export class ToastComponent implements OnInit, OnDestroy, AfterViewInit {
    @HostBinding('style.cursor') protected cursor = 'pointer';
    @HostListener('click') private onClick = () => this.buttons.length === 0 && this.close();

    @HostBinding('className') protected className: string = 'ngx-helper-m3-toast';
    @HostBinding('style.top') protected top: string = '0';
    @HostBinding('style.color') public textColor!: string;
    @HostBinding('style.border-color') public borderColor!: string;
    @HostBinding('style.background-color') public backgroundColor!: string;

    @Input({ required: true }) topSignal: WritableSignal<string> = signal('-100px');
    @Input({ required: true }) id!: string;
    @Input({ required: true }) icon!: string;
    @Input({ required: true }) messages: string[] = [];
    @Input({ required: true }) config!: { helper?: Partial<INgxHelperConfig>; toast: Partial<INgxHelperToastConfig> };
    @Input({ required: true }) init!: () => void;
    @Input({ required: true }) close!: () => void;

    private readonly router: Router = inject(Router);

    public progress: WritableSignal<number> = signal(0);
    public start: WritableSignal<number> = signal(0);

    protected buttons: IButton[] = [];

    protected timeout!: number;
    protected showClose!: boolean;
    protected animation!: 'DECREASE' | 'INCREASE';

    private interval?: any;

    constructor(
        public readonly elementRef: ElementRef,
        private readonly changeDetectorRef: ChangeDetectorRef,
    ) {
        effect(() => {
            this.top = this.topSignal();
            this.changeDetectorRef.markForCheck();
        });
    }

    ngOnInit(): void {
        this.borderColor = this.backgroundColor;

        const xPosition: 'LEFT' | 'CENTER' | 'RIGHT' = this.config.helper?.toastXPosition || 'CENTER';
        this.className = `ngx-helper-m3-toast ${xPosition.toLowerCase()}`;

        this.buttons = this.config?.toast?.buttons || [];
        this.cursor = this.buttons.length === 0 ? 'pointer' : 'default';

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

        if (this.timeout && this.buttons.length === 0) {
            this.start.set(new Date().getTime());
            this.interval = setInterval(() => {
                const timer: number = new Date().getTime();
                let progress: number = ((timer - this.start()) * 100) / this.timeout;
                progress = progress < 100 ? +progress.toFixed(2) : 100;

                this.progress.set(progress);
                if (this.progress() === 100) this.close();
            }, 25);
        }
    }

    ngOnDestroy(): void {
        if (this.interval) clearInterval(this.interval);
    }

    ngAfterViewInit(): void {
        timer(0).subscribe(() => {
            this.init();
            this.changeDetectorRef.markForCheck();
        });
    }

    buttonClick(button: IButton): void {
        // ROUTE
        if (typeof button.action !== 'function') {
            this.router.navigate(button.action);
            this.close();
        }

        // FUNCTION
        if (typeof button.action === 'function') {
            const response = button.action();
            if (!!response) {
                this.router.navigate(response);
                this.close();
            } else this.close();
        }
    }
}
