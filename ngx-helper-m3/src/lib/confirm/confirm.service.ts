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

class NgxHelperConfirm {
    constructor(
        private readonly matBottomSheet: MatBottomSheet,
        private readonly matDialog: MatDialog,
        private readonly confirm: INgxHelperConfirm,
    ) {}

    dialog(onConfirmed: () => void): void;
    dialog(onConfirmed: () => void, onDenied: () => void): void;
    dialog(onConfirmed: () => void, config: MatDialogConfig): void;
    dialog(onConfirmed: () => void, onDenied: () => void, config: MatDialogConfig): void;
    dialog(onConfirmed: () => void, arg1?: any, arg2?: any): void {
        const onDenied: (() => void) | undefined = typeof arg1 === 'function' ? arg1 : undefined;
        const config: MatDialogConfig = arg2 || (typeof arg1 !== 'function' ? arg1 : {});

        this.matDialog
            .open<any, any, boolean>(ConfirmDialogComponent, {
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
            .subscribe({ next: (confirmed?: boolean) => (!!confirmed ? onConfirmed() : onDenied ? onDenied() : undefined) });
    }

    bottomSheet(onConfirmed: () => void): void;
    bottomSheet(onConfirmed: () => void, onDenied: () => void): void;
    bottomSheet(onConfirmed: () => void, config: MatBottomSheetConfig): void;
    bottomSheet(onConfirmed: () => void, onDenied: () => void, config: MatBottomSheetConfig): void;
    bottomSheet(onConfirmed: () => void, arg1?: any, arg2?: any): void {
        const onDenied: (() => void) | undefined = typeof arg1 === 'function' ? arg1 : undefined;
        const config: MatBottomSheetConfig = arg2 || (typeof arg1 !== 'function' ? arg1 : {});

        this.matBottomSheet
            .open<any, any, boolean>(ConfirmBottomSheetComponent, {
                // DEFAULT CONFIG
                direction: 'rtl',
                // OVERWRITE CONFIG
                ...config,
                maxHeight: '80vh',
                // DATA
                data: this.confirm,
            })
            .afterDismissed()
            .subscribe({ next: (confirmed?: boolean) => (!!confirmed ? onConfirmed() : onDenied ? onDenied() : undefined) });
    }
}

@Injectable({ providedIn: 'root' })
export class NgxHelperConfirmService {
    constructor(private readonly matBottomSheet: MatBottomSheet, private readonly matDialog: MatDialog) {}

    verify(confirm: INgxHelperConfirm): NgxHelperConfirm {
        return new NgxHelperConfirm(this.matBottomSheet, this.matDialog, confirm);
    }

    active(data: IConfirmData): NgxHelperConfirm;
    active(data: IConfirmData, description: string): NgxHelperConfirm;
    active(data: IConfirmData, description?: string): NgxHelperConfirm {
        return this.verify({
            question: `آیا می‌خواهید ${data.title} انتخاب شده را فعال کنید؟`,
            description,
            data: data.value ? { title: data.title, value: data.value } : undefined,
            icon: 'check_box',
            color: 'primary',
        });
    }

    deactive(data: IConfirmData): NgxHelperConfirm;
    deactive(data: IConfirmData, description: string): NgxHelperConfirm;
    deactive(data: IConfirmData, description?: string): NgxHelperConfirm {
        return this.verify({
            question: `آیا می‌خواهید ${data.title} انتخاب شده را غیرفعال کنید؟`,
            description,
            data: data.value ? { title: data.title, value: data.value } : undefined,
            icon: 'disabled_by_default',
            color: 'error',
        });
    }

    delete(data: IConfirmData): NgxHelperConfirm;
    delete(data: IConfirmData, description: string): NgxHelperConfirm;
    delete(data: IConfirmData, description?: string): NgxHelperConfirm {
        return this.verify({
            question: `آیا می‌خواهید ${data.title} انتخاب شده را حذف کنید؟`,
            description,
            data: data.value ? { title: data.title, value: data.value } : undefined,
            icon: 'delete',
            color: 'error',
        });
    }
}
