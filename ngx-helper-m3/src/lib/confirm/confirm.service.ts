import { Injectable } from '@angular/core';

import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { ConfirmDialogComponent } from './dialog/confirm-dialog.component';
import { ConfirmBottomSheetComponent } from './bottom-sheet/confirm-bottom-sheet.component';

import { INgxHelperConfirm } from './confirm.interface';

interface IConfirmData {
    readonly title: string;
    readonly value?: string;
}

interface IConfirmConfig {
    // GENERAL
    readonly description: string;
    readonly confirmClass: string;
    readonly denyClass: string;
    // GET DESCRIPTION
    readonly getDescription?: boolean | 'REQUIRED';
}

class NgxHelperConfirmCalss {
    constructor(
        private readonly matBottomSheet: MatBottomSheet,
        private readonly matDialog: MatDialog,
        private readonly confirm: INgxHelperConfirm,
    ) {}

    dialog(onConfirmed: (description: string | null) => void): void;
    dialog(onConfirmed: (description: string | null) => void, onDenied: () => void): void;
    dialog(onConfirmed: (description: string | null) => void, config: MatDialogConfig): void;
    dialog(onConfirmed: (description: string | null) => void, onDenied: () => void, config: MatDialogConfig): void;
    dialog(onConfirmed: (description: string | null) => void, arg1?: any, arg2?: any): void {
        const onDenied: (() => void) | undefined = typeof arg1 === 'function' ? arg1 : undefined;
        const config: MatDialogConfig = arg2 || (typeof arg1 !== 'function' ? arg1 : {});

        this.matDialog
            .open<any, any, { description: string | null } | null>(ConfirmDialogComponent, {
                // DEFAULT CONFIG
                width: 'calc(100vw - 4rem)',
                direction: 'rtl',
                enterAnimationDuration: '100ms',
                exitAnimationDuration: '100ms',
                // OVERWRITE CONFIG
                ...config,
                maxHeight: '80vh',
                // DATA
                data: this.confirm,
            })
            .afterClosed()
            .subscribe({
                next: (result?: { description: string | null } | null) => {
                    if (!!result) onConfirmed(result.description);
                    else onDenied && onDenied();
                },
            });
    }

    bottomSheet(onConfirmed: (description: string | null) => void): void;
    bottomSheet(onConfirmed: (description: string | null) => void, onDenied: () => void): void;
    bottomSheet(onConfirmed: (description: string | null) => void, config: MatBottomSheetConfig): void;
    bottomSheet(onConfirmed: (description: string | null) => void, onDenied: () => void, config: MatBottomSheetConfig): void;
    bottomSheet(onConfirmed: (description: string | null) => void, arg1?: any, arg2?: any): void {
        const onDenied: (() => void) | undefined = typeof arg1 === 'function' ? arg1 : undefined;
        const config: MatBottomSheetConfig = arg2 || (typeof arg1 !== 'function' ? arg1 : {});

        this.matBottomSheet
            .open<any, any, { description: string | null } | null>(ConfirmBottomSheetComponent, {
                // DEFAULT CONFIG
                direction: 'rtl',
                panelClass: 'ngx-helper-bottom-sheet',
                // OVERWRITE CONFIG
                ...config,
                maxHeight: '80vh',
                // DATA
                data: this.confirm,
            })
            .afterDismissed()
            .subscribe({
                next: (result?: { description: string | null } | null) => {
                    if (!!result) onConfirmed(result.description);
                    else onDenied && onDenied();
                },
            });
    }
}

@Injectable({ providedIn: 'root' })
export class NgxHelperConfirmService {
    constructor(
        private readonly matBottomSheet: MatBottomSheet,
        private readonly matDialog: MatDialog,
    ) {}

    verify(confirm: INgxHelperConfirm): NgxHelperConfirmCalss {
        return new NgxHelperConfirmCalss(this.matBottomSheet, this.matDialog, confirm);
    }

    active(data: IConfirmData): NgxHelperConfirmCalss;
    active(data: IConfirmData, config: Partial<IConfirmConfig>): NgxHelperConfirmCalss;
    active(data: IConfirmData, config?: Partial<IConfirmConfig>): NgxHelperConfirmCalss {
        return this.verify({
            question: `آیا می‌خواهید ${data.title} انتخاب شده را فعال کنید؟`,
            icon: 'check_box',
            data: data.value ? { title: data.title, value: data.value } : undefined,
            // GENERAL
            description: config?.description,
            confirmClass: config?.confirmClass,
            denyClass: config?.denyClass,
            // GET DESCRIPTION
            getDescription: config?.getDescription,
        });
    }

    deactive(data: IConfirmData): NgxHelperConfirmCalss;
    deactive(data: IConfirmData, config: Partial<IConfirmConfig>): NgxHelperConfirmCalss;
    deactive(data: IConfirmData, config?: Partial<IConfirmConfig>): NgxHelperConfirmCalss {
        return this.verify({
            question: `آیا می‌خواهید ${data.title} انتخاب شده را غیرفعال کنید؟`,
            icon: 'disabled_by_default',
            data: data.value ? { title: data.title, value: data.value } : undefined,
            // GENERAL
            description: config?.description,
            confirmClass: config?.confirmClass || 'error',
            denyClass: config?.denyClass,
            // GET DESCRIPTION
            getDescription: config?.getDescription,
        });
    }

    status(active: boolean, data: IConfirmData): NgxHelperConfirmCalss;
    status(active: boolean, data: IConfirmData, config: Partial<IConfirmConfig>): NgxHelperConfirmCalss;
    status(active: boolean, data: IConfirmData, config?: Partial<IConfirmConfig>): NgxHelperConfirmCalss {
        return active ? this.active(data, config || {}) : this.deactive(data, config || {});
    }

    archive(data: IConfirmData): NgxHelperConfirmCalss;
    archive(data: IConfirmData, config: Partial<IConfirmConfig>): NgxHelperConfirmCalss;
    archive(data: IConfirmData, config?: Partial<IConfirmConfig>): NgxHelperConfirmCalss {
        return this.verify({
            question: `آیا می‌خواهید ${data.title} انتخاب شده را آرشیو کنید؟`,
            icon: 'inventory_2',
            data: data.value ? { title: data.title, value: data.value } : undefined,
            // GENERAL
            description: config?.description,
            confirmClass: config?.confirmClass || 'error',
            denyClass: config?.denyClass,
            // GET DESCRIPTION
            getDescription: config?.getDescription,
        });
    }

    restore(data: IConfirmData): NgxHelperConfirmCalss;
    restore(data: IConfirmData, config: Partial<IConfirmConfig>): NgxHelperConfirmCalss;
    restore(data: IConfirmData, config?: Partial<IConfirmConfig>): NgxHelperConfirmCalss {
        return this.verify({
            question: `آیا می‌خواهید ${data.title} انتخاب شده را بازیابی کنید؟`,
            icon: 'restart_alt',
            data: data.value ? { title: data.title, value: data.value } : undefined,
            // GENERAL
            description: config?.description,
            confirmClass: config?.confirmClass,
            denyClass: config?.denyClass,
            // GET DESCRIPTION
            getDescription: config?.getDescription,
        });
    }

    delete(data: IConfirmData): NgxHelperConfirmCalss;
    delete(data: IConfirmData, config: Partial<IConfirmConfig>): NgxHelperConfirmCalss;
    delete(data: IConfirmData, config?: Partial<IConfirmConfig>): NgxHelperConfirmCalss {
        return this.verify({
            question: `آیا می‌خواهید ${data.title} انتخاب شده را حذف کنید؟`,
            icon: 'delete',
            data: data.value ? { title: data.title, value: data.value } : undefined,
            // GENERAL
            description: config?.description,
            confirmClass: config?.confirmClass || 'error',
            denyClass: config?.denyClass,
            // GET DESCRIPTION
            getDescription: config?.getDescription,
        });
    }
}
