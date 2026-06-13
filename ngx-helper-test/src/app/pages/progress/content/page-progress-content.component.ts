import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'page-progress-content',
    imports: [],
    templateUrl: './page-progress-content.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './page-progress-content.component.scss',
})
export class PageProgressContentComponent {
    @Input({ required: true }) height!: string;
    @Input({ required: true }) borderRadius!: string;
}
