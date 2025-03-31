import { Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { Router } from '@angular/router';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { ComponentService, IValueComponentData } from '../../component.service';

import { INgxHelperValue } from '../ngx-helper-value.interface';

@Component({
    selector: 'ngx-helper-value-list',
    imports: [ClipboardModule, MatIcon, MatIconButton],
    providers: [ComponentService],
    templateUrl: './ngx-helper-value-list.component.html',
    styleUrl: './ngx-helper-value-list.component.scss',
})
export class NgxHelperValueListComponent implements OnChanges {
    @HostBinding('className') private className: string = 'ngx-helper-m3-value-list';

    @Input({ required: true }) values!: INgxHelperValue[];
    @Input({ required: false }) titleWidth: string = '20%';
    @Input({ required: false }) emptyText: string = 'نامشخص';

    public data: IValueComponentData[] = [];

    public copyIndex?: number;
    private copyTimeout: any;

    constructor(private readonly router: Router, private readonly componentService: ComponentService) {}

    ngOnChanges(changes: SimpleChanges): void {
        this.data = this.componentService.getValueData(this.values);
    }

    onClick(action?: () => string[] | void): void {
        if (!action) return;

        const response = action();
        if (response) this.router.navigate(response);
    }

    onCopy(event: Event, index: number): void {
        event.preventDefault();

        if (this.copyTimeout) clearTimeout(this.copyTimeout);
        this.copyIndex = index;
        this.copyTimeout = setTimeout(() => {
            this.copyIndex = undefined;
            this.copyTimeout = undefined;
        }, 2000);
    }
}
