import { Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
    selector: 'ngx-helper-loader',
    imports: [],
    templateUrl: './ngx-helper-loader.component.html',
    styleUrl: './ngx-helper-loader.component.scss',
})
export class NgxHelperLoaderComponent implements OnInit, OnChanges {
    @HostBinding('style.--loader-size') public loaderSize!: string;
    @HostBinding('style.--loader-color') public loaderColor!: string;

    @Input({ required: false }) public mode: 'SPINNER' | 'DOTS-SPINNER' | 'WHEEL-SPINNER' = 'SPINNER';
    @Input({ required: false }) public size!: number;
    @Input({ required: false }) public color!: string;
    @Input({ required: false }) public padding?: string;
    @Input({ required: false }) public margin?: string;

    ngOnInit(): void {
        this.init();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.init();
    }

    init(): void {
        this.loaderSize = `${this.size || 25}px`;
        this.loaderColor = this.color || `var(--secondary)`;
    }
}
