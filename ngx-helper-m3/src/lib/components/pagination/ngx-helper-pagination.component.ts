import {
    Component,
    EventEmitter,
    HostBinding,
    Inject,
    Input,
    OnChanges,
    OnInit,
    Optional,
    Output,
    SimpleChanges,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

import { INgxHelperConfig, NGX_HELPER_CONFIG } from '../../ngx-helper.config';

import { INgxHelperPagination } from './ngx-helper-pagination.interface';

@Component({
    selector: 'ngx-helper-pagination',
    imports: [DecimalPipe, MatIcon, MatIconButton, MatMenu, MatMenuTrigger, MatMenuItem],
    templateUrl: './ngx-helper-pagination.component.html',
    styleUrl: './ngx-helper-pagination.component.scss',
})
export class NgxHelperPaginationComponent implements OnInit, OnChanges {
    @HostBinding('className') protected className: string = 'ngx-helper-m3-pagination';
    @HostBinding('style.margin') protected margin: string = '';

    @Input({ required: true }) pagination!: INgxHelperPagination;
    @Output() pageChanged: EventEmitter<number> = new EventEmitter<number>();

    protected pages: number[] = [];
    protected hasShadow!: boolean;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
        @Optional() @Inject(NGX_HELPER_CONFIG) private readonly config?: Partial<INgxHelperConfig>,
    ) {}

    ngOnInit(): void {
        this.margin = this.config?.paginationMargin || '';
        this.hasShadow = !!this.config?.paginationHasShadow;
    }

    ngOnChanges(changes: SimpleChanges): void {
        const isDefaultPage = (page: number): boolean => page === 1 || page === this.pagination.page.total;
        const period: number = Math.floor(this.pagination.page.total / 8) || 1;
        const trunc: number = period < 100 ? 10 : period < 1000 ? 100 : 1000;

        this.pages = Array(this.pagination.page.total)
            .fill('0')
            .map((_, index: number) => index + 1)
            .filter((page: number) => page !== this.pagination.page.current)
            .filter((page: number) => isDefaultPage(page) || (page - 1) % period === 0)
            .map((page: number) => (isDefaultPage(page) || period < 10 ? page : page - (page % trunc)));
    }

    setPage(page: number): void {
        if (this.pagination.route && this.pagination.route.length > 0) {
            const queryParams: { [key: string]: any } = { ...this.activatedRoute.snapshot.queryParams };
            queryParams['ngx-helper-pagination'] = page !== 1 ? page.toString() : undefined;
            this.router.navigate(this.pagination.route, { queryParams });
        }

        this.pageChanged.next(page);
    }
}
