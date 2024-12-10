import { Component, OnInit } from '@angular/core';

import { MatButton } from '@angular/material/button';

import { NgxHelperConfirmService, NgxHelperContainerService } from '@webilix/ngx-helper-m3';

import { ContainerComponent } from '../../components';
import { AppService } from '../../app.service';

@Component({
    host: { selector: 'page-index' },
    imports: [MatButton],
    templateUrl: './page-index.component.html',
    styleUrl: './page-index.component.scss',
})
export class PageIndexComponent implements OnInit {
    constructor(
        private readonly ngxHelperConfirmService: NgxHelperConfirmService,
        private readonly ngxHelperContainerService: NgxHelperContainerService,
        private readonly appService: AppService,
    ) {}

    ngOnInit(): void {
        this.appService.setHeader();
    }

    public confirmType: 'DIALOG' | 'BOTTOMSHEET' = 'DIALOG';
    confirm(type: 'VERIFY' | 'DELETE' | 'ACTIVE' | 'DEACTIVE'): void {
        const confirm =
            type === 'VERIFY'
                ? this.ngxHelperConfirmService.verify({ question: 'می‌خواهید از عضویت خودتان خارج شوید؟', icon: 'logout' })
                : type === 'DELETE'
                ? this.ngxHelperConfirmService.delete(
                      { title: 'گزینه', value: 'مقدار' },
                      {
                          description: 'در صورت تایید، اطلاعات از سیستم حذف شده و امکان بازیابی آنها وجود نخواهد داشت.',
                          denyClass: 'secondary',
                      },
                  )
                : type === 'ACTIVE'
                ? this.ngxHelperConfirmService.active(
                      { title: 'گزینه', value: 'مقدار' },
                      {
                          description:
                              'در صورت تایید، اطلاعات در سیستم فعال می‌شود و امکان استفاده از آنها در سایر بخش‌های سیستم وجود خواهد داشت.',
                      },
                  )
                : this.ngxHelperConfirmService.deactive(
                      { title: 'گزینه', value: 'مقدار' },
                      {
                          description:
                              'در صورت تایید، اطلاعات در سیستم باقی می‌ماند اما امکان استفاده از آنها در سایر بخش‌های سیستم وجود نخواهد داشت.',
                      },
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

    container(type: 'DIALOG' | 'BOTTOMSHEET', component: '1' | '2'): void {
        const title: string = `${type === 'DIALOG' ? 'دیالوگ' : 'باتم‌شیت'} ${component}`;
        const container = this.ngxHelperContainerService.init(ContainerComponent, title, { data: { component } });

        switch (type) {
            case 'DIALOG':
                container.dialog<any>(
                    (response) => console.log('RESPONSE', response),
                    () => console.log('DISMISS'),
                );
                break;
            case 'BOTTOMSHEET':
                container.bottomSheet<any>(
                    (response) => console.log('RESPONSE', response),
                    () => console.log('DISMISS'),
                );
                break;
        }
    }
}
