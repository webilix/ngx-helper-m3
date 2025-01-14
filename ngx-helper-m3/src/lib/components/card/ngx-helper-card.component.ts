import { Component, HostBinding, Inject, Input, OnChanges, OnInit, Optional, SimpleChanges } from '@angular/core';
import { NgClass } from '@angular/common';

import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { INgxHelperConfig, NGX_HELPER_CONFIG } from '../../ngx-helper.config';

import { ComponentService, IComponentConfig } from '../component.service';

import { NgxHelperCardAction } from './ngx-helper-card.interface';

type Button =
    | { type: 'BUTTON'; title: string; icon: string; action: () => void; color?: string; showIcon?: boolean }
    | {
          type: 'MENU';
          title: string;
          icon: string;
          color?: string;
          showIcon?: boolean;
          buttons: ('DIVIDER' | { title: string; icon: string; action: () => void; color?: string })[];
      };

@Component({
    selector: 'ngx-helper-card',
    host: { '(window:resize)': 'onResize($event)' },
    imports: [NgClass, MatButton, MatDivider, MatIcon, MatMenuModule],
    providers: [ComponentService],
    templateUrl: './ngx-helper-card.component.html',
    styleUrl: './ngx-helper-card.component.scss',
})
export class NgxHelperCardComponent implements OnInit, OnChanges {
    @HostBinding('className') private className: string = 'ngx-helper-m3-card';

    @Input({ required: true }) title!: string;
    @Input({ required: false }) subTitle?: string;
    @Input({ required: false }) icon?: string;
    @Input({ required: false }) actions: NgxHelperCardAction[] = [];
    @Input({ required: false }) padding: string = '1rem';
    @Input({ required: false }) backgroundColor?: string;
    @Input({ required: false }) hasShadow: boolean = false;

    public isMobile: boolean = false;
    public buttons: Button[] = [];
    private componentConfig!: IComponentConfig;

    constructor(
        private readonly componentService: ComponentService,
        @Optional() @Inject(NGX_HELPER_CONFIG) private readonly config?: Partial<INgxHelperConfig>,
    ) {}

    ngOnInit(): void {
        this.componentConfig = this.componentService.getComponentConfig(this.config);
        this.onResize();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.className = `ngx-helper-m3-card${this.hasShadow ? ' has-shadow' : ''}`;

        this.buttons = this.actions.map((action) => {
            return 'buttons' in action ? { type: 'MENU', ...action } : { type: 'BUTTON', ...action };
        });
    }

    onResize(): void {
        this.isMobile = window.innerWidth <= this.componentConfig.mobileWidth;
    }
}
