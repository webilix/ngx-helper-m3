import { NgComponentOutlet } from '@angular/common';
import { Component, HostBinding, inject, Injector, OnInit } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import {
    INgxHelperContainerConfig,
    NGX_HELPER_CONTAINER_CLOSE,
    NGX_HELPER_CONTAINER_DATA,
    NGX_HELPER_CONTAINER_TYPE,
} from '../container.interface';

@Component({
    host: { selector: 'container-dialog' },
    imports: [NgComponentOutlet, MatIconButton, MatIcon],
    templateUrl: './container-dialog.component.html',
    styleUrl: './container-dialog.component.scss',
})
export class ContainerDialogComponent implements OnInit {
    @HostBinding('className') private className: string = 'ngx-helper-m3-container';

    public container: {
        component: ComponentType<any>;
        readonly title: string;
        readonly config: INgxHelperContainerConfig;
    } = inject(MAT_DIALOG_DATA);

    public injector!: Injector;

    constructor(private readonly matDialogRef: MatDialogRef<ContainerDialogComponent>) {}

    ngOnInit(): void {
        this.injector = Injector.create({
            providers: [
                { provide: NGX_HELPER_CONTAINER_TYPE, useValue: 'DIALOG' },
                { provide: NGX_HELPER_CONTAINER_DATA, useValue: this.container.config.data },
                {
                    provide: NGX_HELPER_CONTAINER_CLOSE,
                    useFactory: () => (response?: any) => this.matDialogRef.close(response),
                },
            ],
        });
    }

    close(): void {
        this.matDialogRef.close();
    }
}
