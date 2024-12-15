import { Component, HostBinding, Inject, Input, OnInit, Optional } from '@angular/core';

import { INgxHelperConfig, NGX_HELPER_CONFIG } from '../../ngx-helper.config';

import { ComponentService, IComponentConfig } from '../component.service';

@Component({
    selector: 'ngx-helper-section',
    host: { '(window:resize)': 'onResize($event)' },
    imports: [],
    providers: [ComponentService],
    templateUrl: './ngx-helper-section.component.html',
    styleUrl: './ngx-helper-section.component.scss',
})
export class NgxHelperSectionComponent implements OnInit {
    @HostBinding('style.--section-gap') private gap!: string;
    @HostBinding('style.--section-background-color') private backgroundColor!: string;

    @Input({ required: false }) gapSize?: string;
    @Input({ required: false }) mobileView?: boolean;

    public isMobile: boolean = false;
    public componentConfig!: IComponentConfig;

    constructor(
        private readonly componentService: ComponentService,
        @Optional() @Inject(NGX_HELPER_CONFIG) private readonly config?: Partial<INgxHelperConfig>,
    ) {}

    ngOnInit(): void {
        this.componentConfig = this.componentService.getComponentConfig(this.config);

        this.gap = this.gapSize || '1rem';
        this.backgroundColor = this.componentConfig.background;

        this.onResize();
    }

    onResize(): void {
        const mobileWidth: number = this.config?.mobileWidth || 600;
        this.isMobile = this.mobileView || window.innerWidth <= mobileWidth;
    }
}
