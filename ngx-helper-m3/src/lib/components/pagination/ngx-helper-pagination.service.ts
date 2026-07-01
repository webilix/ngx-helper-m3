import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INgxHelperPagination } from './ngx-helper-pagination.interface';

@Injectable({ providedIn: 'root' })
export class NgxHelperPaginationService {
    private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

    getPage(): number {
        const queryParams: { [key: string]: any } = { ...this.activatedRoute.snapshot.queryParams };
        const page: number = +queryParams['ngx-helper-pagination'];
        return !isNaN(page) && page > 0 ? page : 1;
    }

    setPage(pagination: INgxHelperPagination, page: number): INgxHelperPagination {
        if (page < 1) page = 1;
        if (page > pagination.page.total) page = pagination.page.total;

        return { ...pagination, page: { ...pagination.page, current: page } };
    }
}
