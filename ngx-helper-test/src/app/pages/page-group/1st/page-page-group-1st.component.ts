import { Component, inject } from '@angular/core';

import { NGX_HELPER_PAGE_GROUP_TITLE } from '@webilix/ngx-helper-m3';

@Component({
    host: { selector: 'page-page-group-1st' },
    imports: [],
    templateUrl: './page-page-group-1st.component.html',
    styleUrl: './page-page-group-1st.component.scss',
})
export class PagePageGroup1stComponent {
    public title: string = inject(NGX_HELPER_PAGE_GROUP_TITLE);
}
