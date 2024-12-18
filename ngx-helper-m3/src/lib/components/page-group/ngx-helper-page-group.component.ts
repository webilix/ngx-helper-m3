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
    INgxHelperPageGroupItem,
    NGX_HELPER_PAGE_GROUP_DATA,
    NGX_HELPER_PAGE_GROUP_DATA_CHANGE,
    NGX_HELPER_PAGE_GROUP_ITEM,
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
    @HostBinding('className') private className: string = 'ngx-helper-m3-page-group';
    @HostBinding('style.display') display: string = 'none';

    @Input({ required: true }) pageGroup!: INgxHelperPageGroup;
    @Input({ required: false }) pageIndex: number = 0;
    @Input({ required: false }) data?: any;
    @Output() pageIndexChanged: EventEmitter<number> = new EventEmitter<number>();
    @Output() dataChanged: EventEmitter<any> = new EventEmitter<any>();

    public isMobile: boolean = false;
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
        this.display = this.pageGroup.pages.length === 0 ? 'none' : 'flex';
        if (this.pageGroup.pages.length === 0) return;

        this.componentConfig = this.componentService.getComponentConfig(this.config);
        this.sidebarWidth = this.pageGroup.sidebarWidth || this.componentConfig.pageGroupSidebarWidth;

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
        this.isMobile = window.innerWidth <= this.componentConfig.mobileWidth;
        this.className = `ngx-helper-m3-page-group${this.isMobile ? ' mobile-view' : ''}`;
    }

    setInjector(): void {
        if (this.pageGroup.pages.length === 0) return;

        const item: INgxHelperPageGroupItem = {
            index: this.pageIndex,
            title: this.pageGroup.pages[this.pageIndex].title,
            icon: this.pageGroup.pages[this.pageIndex].icon,
        };

        this.injector = Injector.create({
            providers: [
                { provide: NGX_HELPER_PAGE_GROUP_ITEM, useValue: item },
                { provide: NGX_HELPER_PAGE_GROUP_DATA, useValue: this.data },
                { provide: NGX_HELPER_PAGE_GROUP_DATA_CHANGE, useValue: (data: any) => this.dataChanged.next(data) },
            ],
        });
    }

    setPage(index: number): void {
        if (this.pageGroup.pages.length === 0) return;
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
}
