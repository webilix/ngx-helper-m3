import { Component, inject } from '@angular/core';

import { NGX_HELPER_PAGE_GROUP_TITLE } from '@webilix/ngx-helper-m3';

@Component({
    host: { selector: 'page-page-group-3rd' },
    imports: [],
    templateUrl: './page-page-group-3rd.component.html',
    styleUrl: './page-page-group-3rd.component.scss',
})
export class PagePageGroup3rdComponent {
    public title: string = inject(NGX_HELPER_PAGE_GROUP_TITLE);
}
