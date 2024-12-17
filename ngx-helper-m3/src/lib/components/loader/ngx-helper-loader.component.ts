import { Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'ngx-helper-loader',
    imports: [],
    templateUrl: './ngx-helper-loader.component.html',
    styleUrl: './ngx-helper-loader.component.scss',
})
export class NgxHelperLoaderComponent implements OnChanges {
    @HostBinding('style.--loader-size') public loaderSize!: string;
    @HostBinding('style.--loader-color') public loaderColor!: string;

    @Input({ required: true }) public mode!: 'SPINNER' | 'DOTS-SPINNER' | 'WHEEL-SPINNER';
    @Input({ required: false }) public size!: number;
    @Input({ required: false }) public color!: string;
    @Input({ required: false }) public padding?: string;

    ngOnChanges(changes: SimpleChanges): void {
        this.loaderSize = `${this.size || 25}px`;
        this.loaderColor = this.color || `var(--secondary)`;
    }
}
