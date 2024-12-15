import { Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'ngx-helper-section-column',
    imports: [],
    templateUrl: './ngx-helper-section-column.component.html',
    styleUrl: './ngx-helper-section-column.component.scss',
})
export class NgxHelperSectionColumnComponent implements OnChanges {
    @HostBinding('style.flex') flexStyle: string = '1';
    @HostBinding('style.width') widthStyle: string = '*';

    @Input({ required: false }) flex?: number;
    @Input({ required: false }) width?: string;
    @Input({ required: false }) sticky?: 'TOP' | 'BOTTOM';

    ngOnChanges(changes: SimpleChanges): void {
        this.flexStyle = this.width ? 'unset' : this.flex?.toString() || '1';
        this.widthStyle = this.width || '*';
    }
}
