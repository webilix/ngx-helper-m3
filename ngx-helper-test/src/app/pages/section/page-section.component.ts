import { Component } from '@angular/core';

import { NgxHelperSectionColumnComponent, NgxHelperSectionComponent } from '@webilix/ngx-helper-m3';

import { AppService } from '../../app.service';

import { PageSectionContentComponent } from './content/page-section-content.component';

@Component({
    host: { selector: 'page-section' },
    imports: [NgxHelperSectionComponent, NgxHelperSectionColumnComponent, PageSectionContentComponent],
    templateUrl: './page-section.component.html',
    styleUrl: './page-section.component.scss',
})
export class PageSectionComponent {
    public gapSize: string = '0.75rem';

    constructor(private readonly appService: AppService) {}

    ngOnInit(): void {
        this.appService.setHeader('SECTION');
    }
}
