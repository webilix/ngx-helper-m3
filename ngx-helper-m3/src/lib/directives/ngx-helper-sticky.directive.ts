import { Directive, ElementRef, inject, Inject, Input, OnInit, Optional } from '@angular/core';

import { INgxHelperConfig, NGX_HELPER_CONFIG } from '../ngx-helper.config';

interface IStickyView {
    readonly top?: { readonly desktopView: string; readonly mobileView: string };
    readonly bottom?: { readonly desktopView: string; readonly mobileView: string };
}

@Directive({
    selector: '[ngxHelperSticky]',
    host: { '(window:resize)': 'onResize($event)' },
})
export class NgxHelperStickyDirective implements OnInit {
    @Input({ required: true }) public ngxHelperSticky!: 'TOP' | 'BOTTOM';
    @Input({ required: false }) public stickyIn: 'ALWAYS' | 'DESKTOP' | 'MOBILE' = 'ALWAYS';
    @Input({ required: false }) public zIndex?: number;

    private mobileWidth!: number;
    private stickyView!: IStickyView;
    private isMobile: boolean = false;

    constructor(
        private readonly elementRef: ElementRef,
        @Optional() @Inject(NGX_HELPER_CONFIG) private readonly config?: Partial<INgxHelperConfig>,
    ) {}

    ngOnInit(): void {
        const getStickyView = (
            config: string | { desktopView: string; mobileView: string },
        ): { desktopView: string; mobileView: string } => {
            return {
                desktopView: typeof config === 'string' ? config : config.desktopView,
                mobileView: typeof config === 'string' ? config : config.mobileView,
            };
        };

        (this.mobileWidth = this.config?.mobileWidth || 600),
            (this.stickyView = {
                top: this.config?.stickyView?.top ? getStickyView(this.config.stickyView.top) : undefined,
                bottom: this.config?.stickyView?.bottom ? getStickyView(this.config.stickyView.bottom) : undefined,
            });

        this.onResize();
    }

    onResize(): void {
        this.isMobile = window.innerWidth <= this.mobileWidth;
        this.setPosition();
    }

    setPosition(): void {
        const element: HTMLElement = this.elementRef.nativeElement;
        if (!element) return;

        const sticky: boolean =
            this.stickyIn === 'ALWAYS' ||
            (this.stickyIn === 'DESKTOP' && !this.isMobile) ||
            (this.stickyIn === 'MOBILE' && this.isMobile);

        switch (this.ngxHelperSticky) {
            case 'TOP':
                const top = this.stickyView.top;
                if (!top) return;

                element.style.position = sticky ? 'sticky' : 'static';
                element.style.zIndex = sticky ? (this.zIndex ? this.zIndex.toString() : '1') : 'auto';
                element.style.top = sticky ? (this.isMobile ? top.mobileView : top.desktopView) : 'auto';
                break;

            case 'BOTTOM':
                const bottom = this.stickyView.bottom;
                if (!bottom) return;

                element.style.position = sticky ? 'sticky' : 'static';
                element.style.zIndex = sticky ? (this.zIndex ? this.zIndex.toString() : '1') : 'auto';
                element.style.bottom = sticky ? (this.isMobile ? bottom.mobileView : bottom.desktopView) : 'auto';
                break;
        }
    }
}
