import { CommonModule } from '@angular/common';
import { Component, inject, Injector, OnInit } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
    INgxHelperContainerConfig,
    NGX_HELPER_CONTAINER_CLOSE,
    NGX_HELPER_CONTAINER_DATA,
    NGX_HELPER_CONTAINER_TYPE,
} from '../container.interface';

@Component({
    host: { selector: 'container-dialog' },
    imports: [CommonModule],
    templateUrl: './container-dialog.component.html',
    styleUrl: './container-dialog.component.scss',
})
export class ContainerDialogComponent implements OnInit {
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
}