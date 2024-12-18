import { Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { Router } from '@angular/router';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { ltrValues } from '../ngx-helper-value.info';
import { INgxHelperValue } from '../ngx-helper-value.interface';
import { NgxHelperValuePipe } from '../ngx-helper-value.pipe';

@Component({
    selector: 'ngx-helper-value-list',
    imports: [ClipboardModule, MatIcon, MatIconButton],
    templateUrl: './ngx-helper-value-list.component.html',
    styleUrl: './ngx-helper-value-list.component.scss',
})
export class NgxHelperValueListComponent implements OnChanges {
    @HostBinding('className') private className: string = 'ngx-helper-m3-value-list';

    @Input({ required: true }) values!: INgxHelperValue[];
    @Input({ required: false }) titleWidth: string = '20%';
    @Input({ required: false }) emptyText: string = 'نامشخص';

    public data: {
        title: string;
        value: string;
        action?: () => string[] | void;
        copyToClipboard?: boolean;
        ltr?: boolean;
        english?: boolean;
    }[] = [];

    public copyIndex?: number;
    private copyTimeout: any;

    private pipeTransform = new NgxHelperValuePipe().transform;

    constructor(private readonly router: Router) {}

    ngOnChanges(changes: SimpleChanges): void {
        this.data = this.values.map((item) => {
            const value = item.value;
            return value === undefined
                ? { title: item.title, value: '' }
                : typeof value === 'string'
                ? { title: item.title, value: value.trim() }
                : {
                      title: item.title,
                      value: this.pipeTransform(value),
                      action: item.action,
                      copyToClipboard: item.copyToClipboard,
                      ltr: ltrValues.includes(value.type),
                      english: 'english' in value && !!value.english,
                  };
        });
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
