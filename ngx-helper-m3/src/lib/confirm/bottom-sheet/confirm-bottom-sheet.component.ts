import { Component, HostBinding, inject } from '@angular/core';
import { NgClass } from '@angular/common';

import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { INgxHelperConfirm } from '../confirm.interface';

@Component({
    host: { selector: 'confirm-bottom-sheet' },
    imports: [NgClass, MatButtonModule, MatIconModule],
    templateUrl: './confirm-bottom-sheet.component.html',
    styleUrl: './confirm-bottom-sheet.component.scss',
})
export class ConfirmBottomSheetComponent {
    @HostBinding('className') protected className: string = 'ngx-helper-m3-confirm';

    public confirm: INgxHelperConfirm = inject(MAT_BOTTOM_SHEET_DATA);

    constructor(private readonly matBottomSheetRef: MatBottomSheetRef<ConfirmBottomSheetComponent>) {}

    close(confirmed?: boolean) {
        this.matBottomSheetRef.dismiss(confirmed);
    }
}
