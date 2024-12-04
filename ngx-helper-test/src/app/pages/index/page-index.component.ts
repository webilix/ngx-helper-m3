import { Component } from '@angular/core';

import { MatButton } from '@angular/material/button';

import { NgxHelperConfirmService } from '@webilix/ngx-helper-m3';

@Component({
    host: { selector: 'page-index' },
    imports: [MatButton],
    templateUrl: './page-index.component.html',
    styleUrl: './page-index.component.scss',
})
export class PageIndexComponent {
    constructor(private readonly ngxHelperConfirmService: NgxHelperConfirmService) {}

    public confirmType: 'DIALOG' | 'BOTTOMSHEET' = 'DIALOG';
    confirm(type: 'VERIFY' | 'DELETE' | 'ACTIVE' | 'DEACTIVE'): void {
        const confirm =
            type === 'VERIFY'
                ? this.ngxHelperConfirmService.verify({ question: 'می‌خواهید از عضویت خودتان خارج شوید؟', icon: 'logout' })
                : type === 'DELETE'
                ? this.ngxHelperConfirmService.delete(
                      { title: 'گزینه', value: 'مقدار' },
                      'در صورت تایید، اطلاعات از سیستم حذف شده و امکان بازیابی آنها وجود نخواهد داشت.',
                  )
                : type === 'ACTIVE'
                ? this.ngxHelperConfirmService.active(
                      { title: 'گزینه', value: 'مقدار' },
                      'در صورت تایید، اطلاعات در سیستم فعال می‌شود و امکان استفاده از آنها در سایر بخش‌های سیستم وجود خواهد داشت.',
                  )
                : this.ngxHelperConfirmService.deactive(
                      { title: 'گزینه', value: 'مقدار' },
                      'در صورت تایید، اطلاعات در سیستم باقی می‌ماند اما امکان استفاده از آنها در سایر بخش‌های سیستم وجود نخواهد داشت.',
                  );

        switch (this.confirmType) {
            case 'DIALOG':
                confirm.dialog(
                    () => console.log('CONFIRMED'),
                    () => console.log('DENIED'),
                );
                break;
            case 'BOTTOMSHEET':
                confirm.bottomSheet(
                    () => console.log('CONFIRMED'),
                    () => console.log('DENIED'),
                );
                break;
        }
    }
}
