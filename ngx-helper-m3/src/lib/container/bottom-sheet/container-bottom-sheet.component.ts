import { NgComponentOutlet } from '@angular/common';
import { Component, HostBinding, inject, Injector, OnInit } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import {
    INgxHelperContainerConfig,
    NGX_HELPER_CONTAINER_CLOSE,
    NGX_HELPER_CONTAINER_DATA,
    NGX_HELPER_CONTAINER_TYPE,
} from '../container.interface';

@Component({
    host: { selector: 'container-bottom-sheet' },
    imports: [NgComponentOutlet, MatIconButton, MatIcon],
    templateUrl: './container-bottom-sheet.component.html',
    styleUrl: './container-bottom-sheet.component.scss',
})
export class ContainerBottomSheetComponent implements OnInit {
    @HostBinding('className') protected className: string = 'ngx-helper-m3-container';

    public container: {
        component: ComponentType<any>;
        readonly title: string;
        readonly config: INgxHelperContainerConfig;
    } = inject(MAT_BOTTOM_SHEET_DATA);

    public injector!: Injector;

    constructor(private readonly matBottomSheetRef: MatBottomSheetRef<ContainerBottomSheetComponent>) {}

    ngOnInit(): void {
        this.injector = Injector.create({
            providers: [
                { provide: NGX_HELPER_CONTAINER_TYPE, useValue: 'BOTTOMSHEET' },
                { provide: NGX_HELPER_CONTAINER_DATA, useValue: this.container.config.data },
                {
                    provide: NGX_HELPER_CONTAINER_CLOSE,
                    useFactory: () => (response?: any) => this.matBottomSheetRef.dismiss(response),
                },
            ],
        });
    }

    close(): void {
        this.matBottomSheetRef.dismiss();
    }
}
