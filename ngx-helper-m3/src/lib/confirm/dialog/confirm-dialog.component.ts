import { Component, HostBinding, inject, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
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

    public confirm: INgxHelperConfirm = inject(MAT_DIALOG_DATA);
}
