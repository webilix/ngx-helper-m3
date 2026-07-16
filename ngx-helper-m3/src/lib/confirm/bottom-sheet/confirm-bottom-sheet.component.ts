import { Component, HostBinding, inject, ChangeDetectionStrategy, WritableSignal, signal } from '@angular/core';
import { NgClass } from '@angular/common';

import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { INgxHelperConfirm } from '../confirm.interface';

@Component({
    host: { selector: 'confirm-bottom-sheet' },
    imports: [NgClass, MatButtonModule, MatIconModule],
    templateUrl: './confirm-bottom-sheet.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './confirm-bottom-sheet.component.scss',
})
export class ConfirmBottomSheetComponent {
    @HostBinding('className') protected className: string = 'ngx-helper-m3-confirm';

    private readonly matBottomSheetRef: MatBottomSheetRef<ConfirmBottomSheetComponent> = inject(
        MatBottomSheetRef<ConfirmBottomSheetComponent>,
    );

    protected ngxHelperconfirm: INgxHelperConfirm = inject(MAT_BOTTOM_SHEET_DATA);
    protected descriptionError: WritableSignal<boolean> = signal(false);
    protected descriptionValue: string | null = null;

    setDescription(value: string): void {
        this.descriptionValue = !!value.trim() ? value.trim() : null;
        this.descriptionError.set(this.ngxHelperconfirm.getDescription === 'REQUIRED' && !this.descriptionValue);
    }

    deny() {
        this.matBottomSheetRef.dismiss(null);
    }

    confirm() {
        if (this.descriptionError()) return;
        this.matBottomSheetRef.dismiss({ description: this.descriptionValue });
    }
}
