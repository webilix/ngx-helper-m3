import {
    Component,
    HostBinding,
    Inject,
    Input,
    OnChanges,
    OnInit,
    Optional,
    SimpleChanges,
    ChangeDetectionStrategy,
} from '@angular/core';
import { NgClass } from '@angular/common';

import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { INgxHelperConfig, NGX_HELPER_CONFIG } from '../../ngx-helper.config';

import { ComponentService, IComponentConfig } from '../component.service';

import { INgxHelperCardOption, NgxHelperCardAction } from './ngx-helper-card.interface';

type MenuButton =
    | 'DIVIDER'
    | {
          title: string;
          icon: string;
          action: () => void;
          color?: string;
          hideIcon?: boolean;
          disabled: boolean;
      };

type Button =
    | {
          type: 'BUTTON';
          title: string;
          icon: string;
          action: () => void;
          color?: string;
          showIcon?: boolean;
          disabled: boolean;
      }
    | {
          type: 'MENU';
          title: string;
          icon: string;
          color?: string;
          showIcon?: boolean;
          buttons: MenuButton[];
          disabled: boolean;
      };

@Component({
    selector: 'ngx-helper-card',
    host: { '(window:resize)': 'onResize()' },
    imports: [NgClass, MatButton, MatDivider, MatIcon, MatMenuModule],
    providers: [ComponentService],
    templateUrl: './ngx-helper-card.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './ngx-helper-card.component.scss',
})
export class NgxHelperCardComponent implements OnInit, OnChanges {
    @HostBinding('className') protected className: string = 'ngx-helper-m3-card';

    @Input({ required: true }) title!: string;
    @Input({ required: false }) subTitle?: string;
    @Input({ required: false }) icon?: string;
    @Input({ required: false }) color?: string;
    @Input({ required: false }) actions: NgxHelperCardAction[] = [];
    @Input({ required: false }) option?: INgxHelperCardOption;
    @Input({ required: false }) padding: string = '1rem';
    @Input({ required: false }) backgroundColor?: string;
    @Input({ required: false }) hasShadow: boolean = false;

    public isMobile: boolean = false;
    public buttons: Button[] = [];
    private componentConfig!: IComponentConfig;

    public optionId?: string;
    public optionTitle?: string;
    public optionItems: ('DIVIDER' | { readonly id: string; readonly title: string })[] = [];

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

        this.buttons = [];
        this.actions.forEach((action) => {
            if (!!action.hideOn && action.hideOn()) return;
            const disabled: boolean = !!action.disableOn && action.disableOn();

            // BUTTON
            if ('action' in action) this.buttons.push({ type: 'BUTTON', ...action, disabled });

            // MENU
            if ('buttons' in action) {
                const menuButtons: MenuButton[] = [];

                action.buttons.forEach((button) => {
                    if (button === 'DIVIDER') {
                        if (menuButtons[menuButtons.length - 1] !== 'DIVIDER') menuButtons.push('DIVIDER');
                        return;
                    }

                    if (!!button.hideOn && button.hideOn()) return;
                    const disabled: boolean = !!button.disableOn && button.disableOn();
                    menuButtons.push({
                        title: button.title,
                        icon: button.icon,
                        action: button.action,
                        color: button.color,
                        hideIcon: button.hideIcon,
                        disabled,
                    });
                });

                while (menuButtons[0] === 'DIVIDER') menuButtons.splice(0, 1);
                while (menuButtons[menuButtons.length - 1] === 'DIVIDER') menuButtons.splice(menuButtons.length - 1);
                if (menuButtons.length > 0) this.buttons.push({ type: 'MENU', ...action, buttons: menuButtons, disabled });
            }
        });

        this.optionId = undefined;
        this.optionItems = [];

        if (this.option) {
            this.option.items.forEach((item) => {
                if (item === 'DIVIDER') {
                    if (this.optionItems.length !== 0 && this.optionItems[this.optionItems.length - 1] !== 'DIVIDER')
                        this.optionItems.push('DIVIDER');
                } else this.optionItems.push(item);
            });
            while (this.optionItems[this.optionItems.length - 1] === 'DIVIDER')
                this.optionItems.splice(this.optionItems.length - 1);

            const ids: string[] = this.option.items.map((item) => (item === 'DIVIDER' ? '' : item.id));
            this.optionId = this.option.id && ids.includes(this.option.id) ? this.option.id : undefined;
            this.setOption(this.optionId || '', true);
        }
    }

    onResize(): void {
        this.isMobile = window.innerWidth <= this.componentConfig.mobileWidth;
    }

    setOption(id: string, firstCheck?: boolean): void {
        if (!this.option || this.optionItems.length === 0) return;

        const ids: string[] = this.optionItems.filter((item) => item !== 'DIVIDER').map((item) => item.id);
        this.optionId = id && ids.includes(id) ? id : ids[0];
        this.optionTitle = this.optionItems
            .filter((item) => item !== 'DIVIDER')
            .find((item) => item.id === this.optionId)?.title;

        if (!firstCheck) this.option.action(this.optionId);
    }
}
