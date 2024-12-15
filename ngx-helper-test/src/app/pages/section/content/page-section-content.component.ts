import { Component, Input } from '@angular/core';

@Component({
    selector: 'page-section-content',
    imports: [],
    templateUrl: './page-section-content.component.html',
    styleUrl: './page-section-content.component.scss',
})
export class PageSectionContentComponent {
    @Input({ required: false }) height: string = '200px';
}
