import { Component, inject } from '@angular/core';

import { NGX_HELPER_PAGE_GROUP_TITLE } from '@webilix/ngx-helper-m3';

@Component({
    host: { selector: 'page-page-group-2nd' },
    imports: [],
    templateUrl: './page-page-group-2nd.component.html',
    styleUrl: './page-page-group-2nd.component.scss',
})
export class PagePageGroup2ndComponent {
    public title: string = inject(NGX_HELPER_PAGE_GROUP_TITLE);
}
