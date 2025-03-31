import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import {
    INgxHelperPageGroupItem,
    NGX_HELPER_PAGE_GROUP_DATA,
    NGX_HELPER_PAGE_GROUP_ITEM,
    NgxHelperDatePipe,
    NgxHelperNumberPipe,
} from '@webilix/ngx-helper-m3';

@Component({
    selector: 'page-page-group-header',
    imports: [MatIcon, NgxHelperDatePipe, NgxHelperNumberPipe],
    templateUrl: './page-page-group-header.component.html',
    styleUrl: './page-page-group-header.component.scss',
})
export class PagePageGroupHeaderComponent {
    public item: INgxHelperPageGroupItem = inject(NGX_HELPER_PAGE_GROUP_ITEM);
    public data: { date: Date; counter: number } = inject(NGX_HELPER_PAGE_GROUP_DATA);
}
