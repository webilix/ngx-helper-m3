import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'page-section-content',
    imports: [],
    templateUrl: './page-section-content.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './page-section-content.component.scss',
})
export class PageSectionContentComponent {
    @Input({ required: false }) height: string = '200px';
}
