import { Component, HostBinding, inject, Inject, Input, OnChanges, OnInit, Optional, SimpleChanges } from '@angular/core';

import { INgxHelperConfig, NGX_HELPER_CONFIG } from '../../../ngx-helper.config';

import { ComponentService, IComponentConfig } from '../../component.service';

@Component({
    selector: 'ngx-helper-section-column',
    host: { '(window:resize)': 'onResize()' },
    imports: [],
    templateUrl: './ngx-helper-section-column.component.html',
    styleUrl: './ngx-helper-section-column.component.scss',
})
export class NgxHelperSectionColumnComponent implements OnInit, OnChanges {
    @HostBinding('style.flex') flexStyle: string = '1';
    @HostBinding('style.width') widthStyle: string = '*';

    @HostBinding('style.position') stickyPosition!: string;
    @HostBinding('style.zInde') stickyZIndex!: string;
    @HostBinding('style.top') stickyTop!: string;

    @Input({ required: false }) flex?: number;
    @Input({ required: false }) width?: string;
    @Input({ required: false }) sticky?: boolean | 'DESKTOP' | 'MOBILE';
    @Input({ required: false }) zIndex?: number;

    private componentConfig!: IComponentConfig;
    private isMobile: boolean = false;

    constructor(
        private readonly componentService: ComponentService,
        @Optional() @Inject(NGX_HELPER_CONFIG) private readonly config?: Partial<INgxHelperConfig>,
    ) {}

    ngOnInit(): void {
        this.componentConfig = this.componentService.getComponentConfig(this.config);
        this.onResize();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.flexStyle = this.width ? 'unset' : this.flex?.toString() || '1';
        this.widthStyle = this.width || '*';

        this.componentConfig = this.componentService.getComponentConfig(this.config);
        this.onResize();
    }

    onResize(): void {
        this.isMobile = window.innerWidth <= this.componentConfig.mobileWidth;
        this.setPosition();
    }

    setPosition(): void {
        const top = this.componentConfig.stickyView?.top;
        if (!top) return;

        const sticky: boolean =
            this.sticky === true ||
            (this.sticky === 'DESKTOP' && !this.isMobile) ||
            (this.sticky === 'MOBILE' && this.isMobile);

        this.stickyPosition = sticky ? 'sticky' : 'static';
        this.stickyZIndex = sticky ? (this.zIndex ? this.zIndex.toString() : '1') : 'auto';
        this.stickyTop = sticky ? (this.isMobile ? top.mobileView : top.desktopView) : 'auto';
    }
}
