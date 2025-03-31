import { Component, OnInit } from '@angular/core';

import {
    INgxHelperCardOption,
    NgxHelperCardAction,
    NgxHelperCardComponent,
    NgxHelperSectionColumnComponent,
    NgxHelperSectionComponent,
} from '@webilix/ngx-helper-m3';

import { AppService } from '../../app.service';

import { PageCardContentComponent } from './content/page-card-content.component';

@Component({
    host: { selector: 'page-card' },
    imports: [NgxHelperCardComponent, NgxHelperSectionComponent, NgxHelperSectionColumnComponent, PageCardContentComponent],
    templateUrl: './page-card.component.html',
    styleUrl: './page-card.component.scss',
})
export class PageCardComponent implements OnInit {
    public icon: string = 'description';
    public actionButtons: NgxHelperCardAction[] = [
        { title: 'ثبت', icon: 'add', action: () => console.log('BUTTON: ADD'), showIcon: true },
        { title: 'ویرایش', icon: 'edit', action: () => console.log('BUTTON: UPDATE') },
        { title: 'حذف', icon: 'delete', action: () => console.log('BUTTON: DELETE'), color: 'var(--error)' },
    ];
    public actionMenu: NgxHelperCardAction[] = [
        {
            title: 'امکانات',
            icon: 'more_vert',
            showIcon: true,
            buttons: [
                { title: 'ثبت', icon: 'add', action: () => console.log('MENU: ADD') },
                { title: 'ویرایش', icon: 'edit', action: () => console.log('MENU: UPDATE') },
                'DIVIDER',
                { title: 'حذف', icon: 'delete', action: () => console.log('MENU: DELETE'), color: 'var(--error)' },
            ],
        },
    ];
    public actions: NgxHelperCardAction[] = [...this.actionButtons, ...this.actionMenu];

    public cardOption: INgxHelperCardOption = {
        id: '2ND',
        icon: 'checklist_rtl',
        items: [
            'DIVIDER',
            'DIVIDER',
            { id: '1ST', title: 'گزینه اول' },
            { id: '2ND', title: 'گزینه دوم' },
            { id: '3RD', title: 'گزینه سوم' },
            'DIVIDER',
            'DIVIDER',
            { id: 'LAST', title: 'گزینه آخر امکانات' },
            'DIVIDER',
            'DIVIDER',
        ],
        action: (id: string) => console.log(`CARD MENU :: ${id}`),
    };

    constructor(private readonly appService: AppService) {}

    ngOnInit(): void {
        this.appService.setHeader('CARD');
    }
}
