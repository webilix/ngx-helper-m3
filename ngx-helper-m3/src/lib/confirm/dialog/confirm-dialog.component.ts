import { Component, HostBinding, inject, ChangeDetectionStrategy, WritableSignal, signal } from '@angular/core';
import { NgClass } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { INgxHelperConfirm } from '../confirm.interface';

@Component({
    host: { selector: 'confirm-dialog' },
    imports: [NgClass, MatButtonModule, MatDialogModule, MatIconModule],
    templateUrl: './confirm-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
    @HostBinding('className') protected className: string = 'ngx-helper-m3-confirm';

    private readonly matDialogRef: MatDialogRef<ConfirmDialogComponent> = inject(MatDialogRef<ConfirmDialogComponent>);

    protected ngxHelperconfirm: INgxHelperConfirm = inject(MAT_DIALOG_DATA);
    protected descriptionError: WritableSignal<boolean> = signal(false);
    protected descriptionValue: string | null = null;

    setDescription(value: string): void {
        this.descriptionValue = !!value.trim() ? value.trim() : null;
        this.descriptionError.set(this.ngxHelperconfirm.getDescription === 'REQUIRED' && !this.descriptionValue);
    }

    deny() {
        this.matDialogRef.close(null);
    }

    confirm() {
        if (this.descriptionError()) return;
        this.matDialogRef.close({ description: this.descriptionValue });
    }
}
