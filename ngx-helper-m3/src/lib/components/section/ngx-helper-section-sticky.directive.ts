import { Directive, ElementRef, inject, Inject, Input, OnInit, Optional } from '@angular/core';

import { INgxHelperConfig, NGX_HELPER_CONFIG } from '../../ngx-helper.config';

import { ComponentService, IComponentConfig } from '../component.service';

@Directive({
    selector: '[ngxHelperSectionSticky]',
    host: { '(window:resize)': 'onResize($event)' },
})
export class NgxHelperSectionStickyDirective implements OnInit {
    @Input({ required: true }) public ngxHelperSectionSticky!: 'TOP' | 'BOTTOM';
    @Input({ required: false }) public ngxHelperSectionZIndex?: number;

    private componentService = inject(ComponentService);
    private componentConfig!: IComponentConfig;
    private isMobile: boolean = false;

    constructor(
        private readonly elementRef: ElementRef,
        @Optional() @Inject(NGX_HELPER_CONFIG) private readonly config?: Partial<INgxHelperConfig>,
    ) {}

    ngOnInit(): void {
        this.componentConfig = this.componentService.getComponentConfig(this.config);
        this.onResize();
    }

    onResize(): void {
        this.isMobile = window.innerWidth <= this.componentConfig.mobileWidth;
        this.setPosition();
    }

    setPosition(): void {
        const element: HTMLElement = this.elementRef.nativeElement;
        if (!element) return;

        switch (this.ngxHelperSectionSticky) {
            case 'TOP':
                const top = this.componentConfig.stickyView?.top;
                if (!top) return;

                element.style.position = 'sticky';
                element.style.zIndex = this.ngxHelperSectionZIndex ? this.ngxHelperSectionZIndex.toString() : '1';
                element.style.top = this.isMobile ? top.mobileView : top.desktopView;
                break;

            case 'BOTTOM':
                const bottom = this.componentConfig.stickyView?.bottom;
                if (!bottom) return;

                element.style.position = 'sticky';
                element.style.zIndex = this.ngxHelperSectionZIndex ? this.ngxHelperSectionZIndex.toString() : '1';
                element.style.bottom = this.isMobile ? bottom.mobileView : bottom.desktopView;
                break;
        }
    }
}
