import { Component, HostBinding, Inject, Input, OnInit, Optional } from '@angular/core';

import { INgxHelperConfig, NGX_HELPER_CONFIG } from '../../ngx-helper.config';

import { ComponentService, IComponentConfig } from '../component.service';

@Component({
    selector: 'ngx-helper-section',
    host: { '(window:resize)': 'onResize()' },
    imports: [],
    providers: [ComponentService],
    templateUrl: './ngx-helper-section.component.html',
    styleUrl: './ngx-helper-section.component.scss',
})
export class NgxHelperSectionComponent implements OnInit {
    @HostBinding('style.--section-gap') protected gap!: string;

    @Input({ required: false }) gapSize?: string;

    private componentConfig!: IComponentConfig;
    public isMobile: boolean = false;

    constructor(
        private readonly componentService: ComponentService,
        @Optional() @Inject(NGX_HELPER_CONFIG) private readonly config?: Partial<INgxHelperConfig>,
    ) {}

    ngOnInit(): void {
        this.componentConfig = this.componentService.getComponentConfig(this.config);
        this.gap = this.gapSize || '1rem';

        this.onResize();
    }

    onResize(): void {
        this.isMobile = window.innerWidth <= this.componentConfig.mobileWidth;
    }
}
