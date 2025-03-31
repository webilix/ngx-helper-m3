import { Component, inject, OnInit } from '@angular/core';

import { MatButton } from '@angular/material/button';

import {
    NGX_HELPER_CONTAINER_CLOSE,
    NGX_HELPER_CONTAINER_DATA,
    NGX_HELPER_CONTAINER_TYPE,
    NgxHelperContainer,
} from '@webilix/ngx-helper-m3';

@Component({
    host: { selector: 'page-index-container' },
    imports: [MatButton],
    templateUrl: './page-index-container.component.html',
    styleUrl: './page-index-container.component.scss',
})
export class PageIndexContainerComponent implements OnInit {
    public type: NgxHelperContainer = inject(NGX_HELPER_CONTAINER_TYPE);
    public data: { component: '1' | '2' } = inject(NGX_HELPER_CONTAINER_DATA);
    public close = inject(NGX_HELPER_CONTAINER_CLOSE);

    public lines: string[] = [];

    ngOnInit(): void {
        this.lines = Array(this.data.component === '1' ? 10 : 50).fill('');
    }
}
