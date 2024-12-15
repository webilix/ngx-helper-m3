import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit, RendererFactory2 } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { AppService } from './app.service';

type ColorMode = 'LIGHT' | 'DARK';

@Component({
    selector: 'app-root',
    host: { '(window:keydown)': 'onKeydown($event)', '(window:resize)': 'onResize($event)' },
    imports: [RouterLink, RouterOutlet, MatDivider, MatIconButton, MatIcon, MatMenuModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
    @HostBinding('style.--header-height') headerHeight: string = '95px';

    public isMobile!: boolean;
    public colorMode!: ColorMode;

    public header?: string;
    private onHeaderChanged!: Subscription;

    constructor(
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly rendererFactory: RendererFactory2,
        private readonly appService: AppService,
    ) {}

    ngOnInit(): void {
        this.header = this.appService.header;
        this.onHeaderChanged = this.appService.onHeaderChanged.subscribe({
            next: (header?: string) => {
                this.header = header;
                this.changeDetectorRef.detectChanges();
            },
        });

        let colorMode: ColorMode = 'LIGHT';
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) colorMode = 'DARK';
        const mode = localStorage.getItem('ColorMode');
        if (mode === 'DARK') colorMode = 'DARK';
        if (mode === 'LIGHT') colorMode = 'LIGHT';
        this.toggleMode(colorMode);

        this.onResize();
    }

    ngOnDestroy(): void {
        this.onHeaderChanged.unsubscribe();
    }

    onKeydown(event: any): void {
        if (!(event instanceof KeyboardEvent)) return;

        // Use CTRL + SHIFT + ALT + C to toggle mode
        if (event.ctrlKey && event.shiftKey && event.altKey && event.code === 'KeyC') {
            event.preventDefault();
            this.toggleMode();
        }
    }

    onResize(): void {
        this.isMobile = window.innerWidth <= 600;
        this.headerHeight = this.isMobile ? '55px' : '95px';
    }

    toggleMode(colorMode?: ColorMode): void {
        this.colorMode = colorMode || (this.colorMode === 'DARK' ? 'LIGHT' : 'DARK');
        localStorage.setItem('ColorMode', this.colorMode);

        const renderer = this.rendererFactory.createRenderer(null, null);
        if (this.colorMode === 'LIGHT') {
            renderer.removeClass(document.body, 'dark');
        } else {
            renderer.addClass(document.body, 'dark');
        }
    }
}
