import { Component, inject } from '@angular/core';

import { NGX_HELPER_PAGE_GROUP_TITLE } from '@webilix/ngx-helper-m3';

@Component({
    host: { selector: 'page-page-group-5th' },
    imports: [],
    templateUrl: './page-page-group-5th.component.html',
    styleUrl: './page-page-group-5th.component.scss',
})
export class PagePageGroup5thComponent {
    public title: string = inject(NGX_HELPER_PAGE_GROUP_TITLE);
}
