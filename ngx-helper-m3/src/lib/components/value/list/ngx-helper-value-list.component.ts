import {
    Component,
    HostBinding,
    Input,
    OnChanges,
    SimpleChanges,
    ChangeDetectionStrategy,
    signal,
    WritableSignal,
} from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { Router } from '@angular/router';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { ComponentService, IValueComponentData } from '../../component.service';

import { INgxHelperValue } from '../ngx-helper-value.interface';

@Component({
    selector: 'ngx-helper-value-list',
    imports: [ClipboardModule, MatIcon, MatIconButton],
    providers: [ComponentService],
    templateUrl: './ngx-helper-value-list.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './ngx-helper-value-list.component.scss',
})
export class NgxHelperValueListComponent implements OnChanges {
    @HostBinding('className') protected className: string = 'ngx-helper-m3-value-list';

    @Input({ required: true }) values!: INgxHelperValue[];
    @Input({ required: false }) titleWidth: string = '20%';
    @Input({ required: false }) emptyText: string = 'نامشخص';

    public data: IValueComponentData[] = [];

    public copyIndex: WritableSignal<number | null> = signal(null);
    private copyTimeout: any;

    constructor(
        private readonly router: Router,
        private readonly componentService: ComponentService,
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        this.data = this.componentService.getValueData(this.values);
    }

    onClick(action?: () => string[] | void): void {
        if (!action) return;

        const response = action();
        if (response) this.router.navigate(response);
    }

    onCopy(event: Event, index: number): void {
        event.preventDefault();

        if (this.copyTimeout) clearTimeout(this.copyTimeout);
        this.copyIndex.update(() => index);
        this.copyTimeout = setTimeout(() => {
            this.copyIndex.update(() => null);
            this.copyTimeout = undefined;
        }, 2000);
    }
}
