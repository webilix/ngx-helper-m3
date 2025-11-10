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

import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { Helper } from '@webilix/helper-library';

import { INgxHelperConfig, NGX_HELPER_CONFIG } from '../../ngx-helper.config';

import { ComponentService, IComponentConfig } from '../component.service';

import {
    INgxHelperPageGroup,
    INgxHelperPageGroupItem,
    NGX_HELPER_PAGE_GROUP_DATA,
    NGX_HELPER_PAGE_GROUP_DATA_CHANGE,
    NGX_HELPER_PAGE_GROUP_ITEM,
} from './ngx-helper-page-group.interface';

@Component({
    selector: 'ngx-helper-page-group',
    host: { '(window:resize)': 'onResize()' },
    imports: [NgComponentOutlet, MatButton, MatIcon, MatMenuModule],
    providers: [ComponentService],
    templateUrl: './ngx-helper-page-group.component.html',
    styleUrl: './ngx-helper-page-group.component.scss',
})
export class NgxHelperPageGroupComponent implements OnInit, OnChanges {
    @HostBinding('className') protected className: string = 'ngx-helper-m3-page-group';
    @HostBinding('style.display') public display: string = 'none';

    @Input({ required: true }) pageGroup!: INgxHelperPageGroup;
    @Input({ required: false }) pageId!: string;
    @Input({ required: false }) data?: any;
    @Output() pageChanged: EventEmitter<INgxHelperPageGroupItem> = new EventEmitter<INgxHelperPageGroupItem>();
    @Output() dataChanged: EventEmitter<any> = new EventEmitter<any>();

    public isMobile: boolean = false;
    public pages: string[] = [];
    public injector!: Injector;

    public sidebarWidth!: string;
    public componentConfig!: IComponentConfig;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly componentService: ComponentService,
        @Optional() @Inject(NGX_HELPER_CONFIG) private readonly config?: Partial<INgxHelperConfig>,
    ) {}

    ngOnInit(): void {
        this.pages = Object.keys(this.pageGroup.pages);
        this.display = this.pages.length === 0 ? 'none' : 'flex';
        if (this.pages.length === 0) return;

        this.componentConfig = this.componentService.getComponentConfig(this.config);
        this.sidebarWidth = this.pageGroup.sidebarWidth || this.componentConfig.pageGroupSidebarWidth;

        if (!this.pageGroup.pages[this.pageId]) this.pageId = this.pages[0];

        const queryParams: { [key: string]: any } = { ...this.activatedRoute.snapshot.queryParams };
        if (!!this.pageGroup.route && Helper.IS.string(queryParams['ngx-helper-page-group'])) {
            const id: string = queryParams['ngx-helper-page-group'];
            if (this.pageId !== id && this.pages.includes(id)) {
                this.pageId = id;
                this.triggerPageChanged();
            }
        }

        this.onResize();
        this.setInjector();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.setInjector();
    }

    onResize(): void {
        this.isMobile = window.innerWidth <= this.componentConfig.mobileWidth;
        this.className = `ngx-helper-m3-page-group${this.isMobile ? ' mobile-view' : ''}`;
    }

    setInjector(): void {
        if (this.pages.length === 0) return;

        const item: INgxHelperPageGroupItem = {
            index: this.pages.findIndex((page) => page === this.pageId),
            id: this.pageId,
            title: this.pageGroup.pages[this.pageId].title,
            icon: this.pageGroup.pages[this.pageId].icon,
        };

        this.injector = Injector.create({
            providers: [
                { provide: NGX_HELPER_PAGE_GROUP_ITEM, useValue: item },
                { provide: NGX_HELPER_PAGE_GROUP_DATA, useValue: this.data },
                { provide: NGX_HELPER_PAGE_GROUP_DATA_CHANGE, useValue: (data: any) => this.dataChanged.next(data) },
            ],
        });
    }

    setPage(id: string): void {
        if (this.pages.length === 0 || this.pageId == id) return;

        const page = this.pageGroup.pages[id];
        const index: number = this.pages.findIndex((p) => p === id);
        if (!page || index === -1) return;

        this.pageId = id;
        this.triggerPageChanged();
        this.setInjector();

        if (this.pageGroup.route) {
            const queryParams: { [key: string]: any } = { ...this.activatedRoute.snapshot.queryParams };
            queryParams['ngx-helper-page-group'] = this.pageId;
            this.router.navigate(this.pageGroup.route, { queryParams });
        }
    }

    triggerPageChanged(): void {
        const item: INgxHelperPageGroupItem = {
            index: this.pages.findIndex((page) => page === this.pageId),
            id: this.pageId,
            title: this.pageGroup.pages[this.pageId].title,
            icon: this.pageGroup.pages[this.pageId].icon,
        };
        this.pageChanged.next(item);
    }
}
