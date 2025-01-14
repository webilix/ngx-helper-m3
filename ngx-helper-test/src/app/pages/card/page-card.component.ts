import { Component, OnInit } from '@angular/core';

import {
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
    public buttons: NgxHelperCardAction[] = [
        { title: 'ثبت', icon: 'add', action: () => console.log('BUTTON: ADD'), showIcon: true },
        { title: 'ویرایش', icon: 'edit', action: () => console.log('BUTTON: UPDATE') },
        { title: 'حذف', icon: 'delete', action: () => console.log('BUTTON: DELETE'), color: 'var(--error)' },
    ];
    public menu: NgxHelperCardAction[] = [
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
    public actions: NgxHelperCardAction[] = [...this.buttons, ...this.menu];

    constructor(private readonly appService: AppService) {}

    ngOnInit(): void {
        this.appService.setHeader('CARD');
    }
}
