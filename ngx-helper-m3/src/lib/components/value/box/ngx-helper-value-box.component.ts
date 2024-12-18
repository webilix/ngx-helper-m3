import { Component, HostBinding, Inject, Input, OnChanges, OnInit, Optional, SimpleChanges } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { Router } from '@angular/router';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { INgxHelperConfig, NGX_HELPER_CONFIG } from '../../../ngx-helper.config';

import { ComponentService, IComponentConfig } from '../../component.service';

import { INgxHelperValue } from '../ngx-helper-value.interface';
import { NgxHelperValuePipe } from '../ngx-helper-value.pipe';
import { ltrValues } from '../ngx-helper-value.info';

@Component({
    selector: 'ngx-helper-value-box',
    host: { '(window:resize)': 'onResize($event)' },
    imports: [ClipboardModule, MatIcon, MatIconButton],
    providers: [ComponentService],
    templateUrl: './ngx-helper-value-box.component.html',
    styleUrl: './ngx-helper-value-box.component.scss',
})
export class NgxHelperValueBoxComponent implements OnInit, OnChanges {
    @HostBinding('className') private className: string = 'ngx-helper-m3-value-box';
    @HostBinding('style.grid-template-columns') private gridTemplateColumns!: string;
    @HostBinding('style.--gap-size') private boxGap!: string;

    @Input({ required: true }) values!: INgxHelperValue[];
    @Input({ required: false }) column?: number | { desktop?: number; mobile?: number };
    @Input({ required: false }) clearBox: boolean = false;
    @Input({ required: false }) emptyText: string = 'نامشخص';
    @Input({ required: false }) gapSize: string = '1rem';

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

    private componentConfig!: IComponentConfig;
    private pipeTransform = new NgxHelperValuePipe().transform;

    constructor(
        private readonly router: Router,
        private readonly componentService: ComponentService,
        @Optional() @Inject(NGX_HELPER_CONFIG) private readonly config?: Partial<INgxHelperConfig>,
    ) {}

    ngOnInit(): void {
        this.componentConfig = this.componentService.getComponentConfig(this.config);
        this.onResize();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.boxGap = this.gapSize;
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

    onResize(): void {
        if (this.values.length === 0) return;

        const isMobile: boolean = window.innerWidth <= this.componentConfig.mobileWidth;
        const columnSize: number =
            this.column === undefined
                ? this.values.length - 1
                : typeof this.column === 'number'
                ? this.column
                : isMobile
                ? this.column.mobile || this.values.length - 1
                : this.column.desktop || this.values.length - 1;

        const column: number = columnSize < 0 || columnSize > this.values.length - 1 ? this.values.length - 1 : columnSize;
        this.gridTemplateColumns = Array(column).fill('1fr').join(' ');
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
