import { Component, inject } from '@angular/core';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import {
    INgxHelperPageGroupItem,
    NGX_HELPER_PAGE_GROUP_DATA_CHANGE,
    NGX_HELPER_PAGE_GROUP_ITEM,
} from '@webilix/ngx-helper-m3';

@Component({
    host: { selector: 'page-page-group-2nd' },
    imports: [MatIcon, MatIconButton],
    templateUrl: './page-page-group-2nd.component.html',
    styleUrl: './page-page-group-2nd.component.scss',
})
export class PagePageGroup2ndComponent {
    public item: INgxHelperPageGroupItem = inject(NGX_HELPER_PAGE_GROUP_ITEM);
    public dataChanged: (change: number) => void = inject(NGX_HELPER_PAGE_GROUP_DATA_CHANGE);
}
