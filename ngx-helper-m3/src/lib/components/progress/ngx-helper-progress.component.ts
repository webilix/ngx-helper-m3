import { Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'ngx-helper-progress',
    imports: [],
    templateUrl: './ngx-helper-progress.component.html',
    styleUrl: './ngx-helper-progress.component.scss',
})
export class NgxHelperProgressComponent implements OnChanges {
    @HostBinding('className') private className: string = 'ngx-helper-m3-progress';
    @HostBinding('style.border-radius') borderRadiusCSS!: string;
    @HostBinding('style.background-color') backgroundColorCSS!: string;

    @Input({ required: true }) value!: number | { done: number; total: number };
    @Input({ required: false }) align: 'LR' | 'RL' | 'TB' | 'BT' = 'LR';
    @Input({ required: false }) borderRadius: string = '0px';
    @Input({ required: false }) progressColor: string = 'var(--surface-container)';
    @Input({ required: false }) backgroundColor?: string;

    public size!: string;
    public direction!: 'H' | 'V';

    ngOnChanges(changes: SimpleChanges): void {
        this.className = `ngx-helper-m3-progress ${this.align}`;
        this.borderRadiusCSS = this.borderRadius;
        this.backgroundColorCSS = this.backgroundColor || 'transparent';

        let value: number = typeof this.value === 'number' ? this.value : (this.value.done / this.value.total) * 100;
        if (isNaN(value) || value < 0) value = 0;
        else if (value > 100) value = 100;
        this.size = `${value.toFixed(2)}%`;
        this.direction = this.align === 'LR' || this.align === 'RL' ? 'H' : 'V';
    }
}
