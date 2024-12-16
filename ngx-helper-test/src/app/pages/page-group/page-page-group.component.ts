import { Component, OnInit } from '@angular/core';

import { INgxHelperPageGroup, NgxHelperPageGroupComponent } from '@webilix/ngx-helper-m3';

import { AppService } from '../../app.service';

import { PagePageGroup1stComponent } from './1st/page-page-group-1st.component';
import { PagePageGroup2ndComponent } from './2nd/page-page-group-2nd.component';
import { PagePageGroup3rdComponent } from './3rd/page-page-group-3rd.component';
import { PagePageGroup4thComponent } from './4th/page-page-group-4th.component';
import { PagePageGroup5thComponent } from './5th/page-page-group-5th.component';
import { PagePageGroupHeaderComponent } from './header/page-page-group-header.component';

@Component({
    host: { selector: 'page-page-group' },
    imports: [NgxHelperPageGroupComponent],
    templateUrl: './page-page-group.component.html',
    styleUrl: './page-page-group.component.scss',
})
export class PagePageGroupComponent implements OnInit {
    public data: { date: Date } = { date: new Date() };
    public pageGroup: INgxHelperPageGroup = {
        route: ['/page-group'],
        header: PagePageGroupHeaderComponent,
        pages: [
            { title: 'عنوان صفحه اول', icon: 'description', component: PagePageGroup1stComponent },
            { title: 'عنوان صفحه دوم', icon: 'task', component: PagePageGroup2ndComponent },
            { title: 'عنوان صفحه سوم', icon: 'upload_file', component: PagePageGroup3rdComponent },
            { title: 'عنوان صفحه چهارم', icon: 'note_add', component: PagePageGroup4thComponent },
            { title: 'عنوان صفحه پنچم', icon: 'file_open', component: PagePageGroup5thComponent },
        ],
    };

    constructor(private readonly appService: AppService) {}

    ngOnInit(): void {
        this.appService.setHeader('PAGE-GROUP');

        setInterval(() => (this.data = { date: new Date() }), 5 * 1000);
    }

    pageIndexChanged(index: number): void {
        console.log('pageIndexChanged', index);
    }
}
