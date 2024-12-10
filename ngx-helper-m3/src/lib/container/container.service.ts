import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { ContainerDialogComponent } from './dialog/container-dialog.component';
import { ContainerBottomSheetComponent } from './bottom-sheet/container-bottom-sheet.component';

import { INgxHelperContainerConfig } from './container.interface';

interface IContainerData {
    readonly component: ComponentType<any>;
    readonly title: string;
    readonly config: INgxHelperContainerConfig;
}

class NgxHelperContainerCalss {
    constructor(
        private readonly matBottomSheet: MatBottomSheet,
        private readonly matDialog: MatDialog,
        private readonly container: IContainerData,
    ) {}

    dialog<T>(): void;
    dialog<T>(onResponse: (response: T) => void): void;
    dialog<T>(onResponse: (response: T) => void, onDismiss: () => void): void;
    dialog<T>(onResponse: (response: T) => void, config: MatDialogConfig): void;
    dialog<T>(onResponse: (response: T) => void, onDismiss: () => void, config: MatDialogConfig): void;
    dialog<T>(arg1?: any, arg2?: any, arg3?: any): void {
        const onResponse: ((response: T) => void) | undefined = typeof arg1 === 'function' ? arg1 : undefined;
        const onDismiss: (() => void) | undefined = typeof arg2 === 'function' ? arg2 : undefined;
        const config: MatDialogConfig = arg3 || (typeof arg2 !== 'function' ? arg2 : {});

        this.matDialog
            .open(ContainerDialogComponent, {
                // DEFAULT CONFIG
                width: 'calc(100vw - 4rem)',
                direction: 'rtl',
                enterAnimationDuration: '100ms',
                exitAnimationDuration: '100ms',
                // OVERWRITE CONFIG
                ...config,
                maxHeight: '80vh',
                // DATA
                data: this.container,
            })
            .afterClosed()
            .subscribe({
                next: (response?: T) => {
                    if (onResponse && !!response) onResponse(response);
                    if (onDismiss && !response) onDismiss();
                },
            });
    }

    bottomSheet<T>(): void;
    bottomSheet<T>(onResponse: (result: T) => void): void;
    bottomSheet<T>(onResponse: (result: T) => void, onDismiss: () => void): void;
    bottomSheet<T>(onResponse: (result: T) => void, config: MatBottomSheetConfig): void;
    bottomSheet<T>(onResponse: (result: T) => void, onDismiss: () => void, config: MatBottomSheetConfig): void;
    bottomSheet<T>(arg1?: any, arg2?: any, arg3?: any): void {
        const onResponse: ((result: T) => void) | undefined = typeof arg1 === 'function' ? arg1 : undefined;
        const onDismiss: (() => void) | undefined = typeof arg2 === 'function' ? arg2 : undefined;
        const config: MatBottomSheetConfig = arg3 || (typeof arg2 !== 'function' ? arg2 : {});

        this.matBottomSheet
            .open<any, any, T>(ContainerBottomSheetComponent, {
                // DEFAULT CONFIG
                direction: 'rtl',
                panelClass: 'ngx-helper-bottom-sheet',
                // OVERWRITE CONFIG
                ...config,
                maxHeight: '80vh',
                // DATA
                data: this.container,
            })
            .afterDismissed()
            .subscribe({
                next: (response?: T) => {
                    if (onResponse && !!response) onResponse(response);
                    if (onDismiss && !response) onDismiss();
                },
            });
    }
}

@Injectable({ providedIn: 'root' })
export class NgxHelperContainerService {
    constructor(private readonly matBottomSheet: MatBottomSheet, private readonly matDialog: MatDialog) {}

    init(component: ComponentType<any>, title: string): NgxHelperContainerCalss;
    init(component: ComponentType<any>, title: string, config: INgxHelperContainerConfig): NgxHelperContainerCalss;
    init(component: ComponentType<any>, title: string, arg1?: any): NgxHelperContainerCalss {
        const config: INgxHelperContainerConfig = arg1 || {};

        return new NgxHelperContainerCalss(this.matBottomSheet, this.matDialog, { component, title, config });
    }
}
