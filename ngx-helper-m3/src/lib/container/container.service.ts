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
    dialog<T>(callback: (result: T) => void): void;
    dialog<T>(config: MatDialogConfig): void;
    dialog<T>(callback: (result: T) => void, config: MatDialogConfig): void;
    dialog<T>(arg1?: any, arg2?: any): void {
        const callback: ((result: T) => void) | undefined = typeof arg1 === 'function' ? arg1 : undefined;
        const config: MatDialogConfig = arg2 || (typeof arg1 !== 'function' ? arg1 : {});

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
            .subscribe({ next: (result?: T) => !!result && callback && callback(result) });
    }

    bottomSheet<T>(): void;
    bottomSheet<T>(callback: (result: T) => void): void;
    bottomSheet<T>(config: MatBottomSheetConfig): void;
    bottomSheet<T>(callback: (result: T) => void, config: MatBottomSheetConfig): void;
    bottomSheet<T>(arg1?: any, arg2?: any): void {
        const callback: ((result: T) => void) | undefined = typeof arg1 === 'function' ? arg1 : undefined;
        const config: MatBottomSheetConfig = arg2 || (typeof arg1 !== 'function' ? arg1 : {});

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
            .subscribe({ next: (result?: T) => !!result && callback && callback(result) });
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
