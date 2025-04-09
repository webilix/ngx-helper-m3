import { Directive, ElementRef, Inject, Input, OnInit, Optional, RendererFactory2 } from '@angular/core';

import { INgxHelperConfig, NGX_HELPER_CONFIG } from '../ngx-helper.config';

@Directive({
    selector: '[ngxHelperMobileView]',
    host: { '(window:resize)': 'onResize($event)' },
})
export class NgxHelperMobileViewDirective implements OnInit {
    @Input({ required: true }) public ngxHelperMobileView!: string;

    private mobileWidth!: number;

    constructor(
        private readonly elementRef: ElementRef,
        private readonly rendererFactory: RendererFactory2,
        @Optional() @Inject(NGX_HELPER_CONFIG) private readonly config?: Partial<INgxHelperConfig>,
    ) {}

    ngOnInit(): void {
        this.mobileWidth = this.config?.mobileWidth || 600;
        this.onResize();
    }

    onResize(): void {
        if (!this.elementRef) return;

        const renderer = this.rendererFactory.createRenderer(null, null);
        const isMobile: boolean = window.innerWidth <= this.mobileWidth;
        if (isMobile) {
            renderer.addClass(this.elementRef.nativeElement, this.ngxHelperMobileView);
        } else {
            renderer.removeClass(this.elementRef.nativeElement, this.ngxHelperMobileView);
        }
    }
}
