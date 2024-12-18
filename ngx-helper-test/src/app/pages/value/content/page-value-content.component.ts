import { Component, inject } from '@angular/core';

import { NGX_HELPER_BOX_DATA } from '@webilix/ngx-helper-m3';

@Component({
    host: { selector: 'page-value-content' },
    imports: [],
    templateUrl: './page-value-content.component.html',
    styleUrl: './page-value-content.component.scss',
})
export class PageValueContentComponent {
    public data?: { content: string } = inject(NGX_HELPER_BOX_DATA);
}
