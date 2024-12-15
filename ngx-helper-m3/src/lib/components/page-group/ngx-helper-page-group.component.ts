import {
    Component,
    EventEmitter,
    HostBinding,
    Inject,
    Injector,
    Input,
    OnChanges,
    OnInit,
    Optional,
    Output,
    SimpleChanges,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { MatIcon } from '@angular/material/icon';

import { Helper } from '@webilix/helper-library';

import { INgxHelperConfig, NGX_HELPER_CONFIG } from '../../ngx-helper.config';

import { ComponentService, IComponentConfig } from '../component.service';

import {
    INgxHelperPageGroup,
    NGX_HELPER_PAGE_GROUP_DATA,
    NGX_HELPER_PAGE_GROUP_INDEX,
    NGX_HELPER_PAGE_GROUP_TITLE,
} from './ngx-helper-page-group.interface';

@Component({
    selector: 'ngx-helper-page-group',
    host: { '(window:resize)': 'onResize($event)' },
    imports: [NgComponentOutlet, MatIcon],
    providers: [ComponentService],
    templateUrl: './ngx-helper-page-group.component.html',
    styleUrl: './ngx-helper-page-group.component.scss',
})
export class NgxHelperPageGroupComponent implements OnInit, OnChanges {
    @HostBinding('style.display') display: string = 'none';
    @HostBinding('style.--mobile-toolbar-height') private toolbarHeight: string = '32px';

    @Input({ required: true }) pageGroup!: INgxHelperPageGroup;
    @Input({ required: false }) pageIndex: number = 0;
    @Input({ required: false }) data?: any;
    @Output() pageIndexChanged: EventEmitter<number> = new EventEmitter<number>();

    public isMobile: boolean = false;
    public injector!: Injector;

    public sidebarWidth!: string;
    public componentConfig!: IComponentConfig;

    private swipeStart?: number;
    private swipeLeft: number = 0;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly componentService: ComponentService,
        @Optional() @Inject(NGX_HELPER_CONFIG) private readonly config?: Partial<INgxHelperConfig>,
    ) {}

    ngOnInit(): void {
        this.display = this.pageGroup.pages.length === 0 ? 'none' : 'block';

        this.sidebarWidth = this.pageGroup.sidebarWidth || this.config?.sidebarWidth || '200px';
        this.componentConfig = this.componentService.getComponentConfig(this.config);

        if (this.pageIndex < 0) this.pageIndex = 0;
        else if (this.pageIndex > this.pageGroup.pages.length - 1) this.pageIndex = this.pageGroup.pages.length - 1;

        const queryParams: { [key: string]: any } = { ...this.activatedRoute.snapshot.queryParams };
        if (!!this.pageGroup.route && Helper.IS.number(+queryParams['ngx-helper-page-group'])) {
            const index: number = +queryParams['ngx-helper-page-group'];
            if (index >= 0 && index <= this.pageGroup.pages.length - 1) {
                this.pageIndex = index;
                this.pageIndexChanged.next(this.pageIndex);
            }
        }

        this.onResize();
        this.setInjector();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.setInjector();
    }

    onResize(): void {
        const mobileWidth: number = this.config?.mobileWidth || 600;
        this.isMobile = this.pageGroup.mobileView || window.innerWidth <= mobileWidth;
    }

    setInjector(): void {
        this.injector = Injector.create({
            providers: [
                { provide: NGX_HELPER_PAGE_GROUP_DATA, useValue: this.data },
                { provide: NGX_HELPER_PAGE_GROUP_INDEX, useValue: this.pageIndex },
                { provide: NGX_HELPER_PAGE_GROUP_TITLE, useValue: this.pageGroup.pages[this.pageIndex].title },
            ],
        });
    }

    setPage(index: number): void {
        if (this.pageIndex === index || index < 0 || index > this.pageGroup.pages.length - 1) return;

        this.pageIndex = index;
        this.pageIndexChanged.next(this.pageIndex);
        this.setInjector();

        if (this.pageGroup.route) {
            const queryParams: { [key: string]: any } = { ...this.activatedRoute.snapshot.queryParams };
            queryParams['ngx-helper-page-group'] = this.pageIndex.toString();
            this.router.navigate(this.pageGroup.route, { queryParams });
        }
    }

    swipe(
        event: MouseEvent | TouchEvent,
        action: 'START' | 'MOVE' | 'END',
        header: HTMLElement,
        container: HTMLElement,
    ): void {
        if (header.offsetWidth > container.offsetWidth) return;
        const clientX: number = event instanceof MouseEvent ? event.clientX : event.changedTouches[0].clientX;

        switch (action) {
            case 'START':
                this.swipeStart = clientX - this.swipeLeft;
                break;
            case 'END':
                this.swipeStart = undefined;

                break;
            case 'MOVE':
                if (!this.swipeStart) return;

                let left: number = clientX - this.swipeStart;

                if (left <= 0) left = 0;
                else if (left > container.offsetWidth - header.offsetWidth)
                    left = container.offsetWidth - header.offsetWidth;

                this.swipeLeft = left;
                container.style.left = `${left}px`;
                break;
        }
    }
}
