import { Component, HostBinding, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { ComponentType } from '@angular/cdk/portal';

import { NGX_HELPER_BOX_DATA } from './ngx-helper-box.interface';

@Component({
    selector: 'ngx-helper-box',
    imports: [NgComponentOutlet],
    templateUrl: './ngx-helper-box.component.html',
    styleUrl: './ngx-helper-box.component.scss',
})
export class NgxHelperBoxComponent implements OnInit, OnChanges {
    @HostBinding('className') protected className: string = 'ngx-helper-m3-box';
    @HostBinding('style.padding') protected paddingCSS!: string;

    @Input({ required: false }) component?: ComponentType<any>;
    @Input({ required: false }) data?: any;
    @Input({ required: false }) padding: string = '1rem';
    @Input({ required: false }) hideShadow: boolean = false;

    public injector!: Injector;

    ngOnInit(): void {
        this.setInjector();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.setInjector();
    }

    setInjector(): void {
        this.paddingCSS = this.padding;
        this.className = `ngx-helper-m3-box${this.hideShadow ? ' hide-shadow' : ''}`;
        if (!this.component) return;

        this.injector = Injector.create({
            providers: [{ provide: NGX_HELPER_BOX_DATA, useValue: this.data }],
        });
    }
}
