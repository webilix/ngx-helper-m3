import { Component, inject } from '@angular/core';

import { NGX_HELPER_PAGE_GROUP_DATA, NgxHelperStickyDirective } from '@webilix/ngx-helper-m3';

@Component({
    host: { selector: 'page-sticky-bottom' },
    imports: [NgxHelperStickyDirective],
    templateUrl: './page-sticky-bottom.component.html',
    styleUrl: './page-sticky-bottom.component.scss',
})
export class PageStickyBottomComponent {
    public data: { stickyIn?: 'DESKTOP' | 'MOBILE' } = inject(NGX_HELPER_PAGE_GROUP_DATA);

    public indexes: number[] = [...Array(20).keys()].map((index) => index + 1);
}
