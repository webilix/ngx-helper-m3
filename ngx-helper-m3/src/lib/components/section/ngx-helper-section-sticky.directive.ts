import { Directive, ElementRef, inject, Inject, Input, OnInit, Optional } from '@angular/core';

import { INgxHelperConfig, NGX_HELPER_CONFIG } from '../../ngx-helper.config';

import { ComponentService } from '../component.service';

@Directive({
    selector: '[ngxHelperSectionSticky]',
    host: { '(window:resize)': 'onResize($event)' },
})
export class NgxHelperSectionStickyDirective implements OnInit {
    @Input({ required: true }) public ngxHelperSectionSticky!: 'TOP' | 'BOTTOM';
    @Input({ required: false }) public ngxHelperSectionZIndex?: number;

    private componentService = inject(ComponentService);
    private isMobile: boolean = false;

    constructor(
        private readonly elementRef: ElementRef,
        @Optional() @Inject(NGX_HELPER_CONFIG) private readonly config?: Partial<INgxHelperConfig>,
    ) {}

    ngOnInit(): void {
        this.onResize();
    }

    onResize(): void {
        const mobileWidth: number = this.config?.mobileWidth || 600;
        this.isMobile = window.innerWidth <= mobileWidth;

        this.setPosition();
    }

    setPosition(): void {
        const element: HTMLElement = this.elementRef.nativeElement;
        if (!element) return;

        const config = this.componentService.getComponentConfig(this.config);
        switch (this.ngxHelperSectionSticky) {
            case 'TOP':
                const top = config.stickyView?.top;
                if (!top) return;

                element.style.position = 'sticky';
                element.style.zIndex = this.ngxHelperSectionZIndex ? this.ngxHelperSectionZIndex.toString() : '1';
                element.style.top = this.isMobile ? top.mobileView : top.desktopView;
                break;

            case 'BOTTOM':
                const bottom = config.stickyView?.bottom;
                if (!bottom) return;

                element.style.position = 'sticky';
                element.style.zIndex = this.ngxHelperSectionZIndex ? this.ngxHelperSectionZIndex.toString() : '1';
                element.style.bottom = this.isMobile ? bottom.mobileView : bottom.desktopView;
                break;
        }
    }
}
