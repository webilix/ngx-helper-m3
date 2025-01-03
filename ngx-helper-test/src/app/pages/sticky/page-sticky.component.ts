import { Component, OnInit } from '@angular/core';

import { INgxHelperPageGroup, INgxHelperPageGroupItem, NgxHelperPageGroupComponent } from '@webilix/ngx-helper-m3';

import { AppService } from '../../app.service';

import { PageStickyBottomComponent } from './bottom/page-sticky-bottom.component';
import { PageStickyTopComponent } from './top/page-sticky-top.component';

@Component({
    host: { selector: 'page-sticky' },
    imports: [NgxHelperPageGroupComponent],
    templateUrl: './page-sticky.component.html',
    styleUrl: './page-sticky.component.scss',
})
export class PageStickyComponent implements OnInit {
    public data: { stickyIn?: 'DESKTOP' | 'MOBILE' } = {};

    public pageId: string = 'top';
    public pageGroup: INgxHelperPageGroup = {
        route: ['/sticky'],
        pages: {
            top: { title: 'بالا', icon: 'north', component: PageStickyTopComponent },
            'top-desktop': { title: 'بالا :: دسکتاپ', icon: 'north', component: PageStickyTopComponent },
            'top-mobile': { title: 'بالا :: موبایل', icon: 'north', component: PageStickyTopComponent },
            bottom: { title: 'پایین', icon: 'south', component: PageStickyBottomComponent },
            'bottom-desktop': { title: 'پایین :: دسکتاپ', icon: 'south', component: PageStickyBottomComponent },
            'bottom-mobile': { title: 'پایین :: موبایل', icon: 'south', component: PageStickyBottomComponent },
        },
    };

    constructor(private readonly appService: AppService) {}

    ngOnInit(): void {
        this.appService.setHeader('STICKY');
        this.setData();
    }

    setPage(page: INgxHelperPageGroupItem): void {
        this.pageId = page.id;
        this.setData();
    }

    setData(): void {
        this.data = {
            stickyIn: this.pageId.includes('desktop') ? 'DESKTOP' : this.pageId.includes('mobile') ? 'MOBILE' : undefined,
        };
        console.log(this.pageId);
    }
}
