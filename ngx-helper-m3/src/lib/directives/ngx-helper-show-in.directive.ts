import { Directive, ElementRef, Inject, Input, OnInit, Optional } from '@angular/core';

import { INgxHelperConfig, NGX_HELPER_CONFIG } from '../ngx-helper.config';

@Directive({ selector: '[ngxHelperShowIn]', host: { '(window:resize)': 'onResize($event)' } })
export class NgxHelperShowInDirective implements OnInit {
    @Input({ required: true }) ngxHelperShowIn!: 'DESKTOP' | 'MOBILE';

    private mobileWidth!: number;

    constructor(
        private readonly elementRef: ElementRef,
        @Optional() @Inject(NGX_HELPER_CONFIG) private readonly config?: Partial<INgxHelperConfig>,
    ) {}

    ngOnInit(): void {
        this.mobileWidth = this.config?.mobileWidth || 600;
        this.onResize();
    }

    onResize(): void {
        if (!this.elementRef) return;

        const element: HTMLElement = this.elementRef.nativeElement;
        const isMobile: boolean = window.innerWidth <= this.mobileWidth;

        switch (this.ngxHelperShowIn) {
            case 'DESKTOP':
                element.style.display = isMobile ? 'none' : '';
                break;
            case 'MOBILE':
                element.style.display = isMobile ? '' : 'none';
                break;
        }
    }
}
