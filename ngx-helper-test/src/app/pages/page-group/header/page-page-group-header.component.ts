import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import {
    NGX_HELPER_PAGE_GROUP_DATA,
    NGX_HELPER_PAGE_GROUP_ICON,
    NGX_HELPER_PAGE_GROUP_INDEX,
    NGX_HELPER_PAGE_GROUP_TITLE,
    NgxHelperDatePipe,
} from '@webilix/ngx-helper-m3';

@Component({
    selector: 'page-page-group-header',
    imports: [MatIcon, NgxHelperDatePipe],
    templateUrl: './page-page-group-header.component.html',
    styleUrl: './page-page-group-header.component.scss',
})
export class PagePageGroupHeaderComponent {
    public data: { date: Date } = inject(NGX_HELPER_PAGE_GROUP_DATA);
    public index: number = inject(NGX_HELPER_PAGE_GROUP_INDEX);
    public title: string = inject(NGX_HELPER_PAGE_GROUP_TITLE);
    public icon: string = inject(NGX_HELPER_PAGE_GROUP_ICON);
}
