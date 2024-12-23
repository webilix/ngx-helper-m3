import { Component, Input } from '@angular/core';

@Component({
    selector: 'page-progress-content',
    imports: [],
    templateUrl: './page-progress-content.component.html',
    styleUrl: './page-progress-content.component.scss',
})
export class PageProgressContentComponent {
    @Input({ required: true }) height!: string;
    @Input({ required: true }) borderRadius!: string;
}
