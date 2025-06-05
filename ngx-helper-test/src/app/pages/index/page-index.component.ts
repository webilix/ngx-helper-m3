import { Component, OnInit } from '@angular/core';

import { MatButton } from '@angular/material/button';

import {
    INgxHelperCoordinates,
    INgxHelperToastConfig,
    NgxHelperConfirmService,
    NgxHelperContainerService,
    NgxHelperCoordinatesService,
    NgxHelperHttpService,
    NgxHelperLoaderComponent,
    NgxHelperMobileViewDirective,
    NgxHelperRoute,
    NgxHelperRouteService,
    NgxHelperToastService,
} from '@webilix/ngx-helper-m3';

import { AppService } from '../../app.service';

import { PageIndexContainerComponent } from './container/page-index-container.component';

@Component({
    host: { selector: 'page-index' },
    imports: [MatButton, NgxHelperLoaderComponent, NgxHelperMobileViewDirective],
    templateUrl: './page-index.component.html',
    styleUrl: './page-index.component.scss',
})
export class PageIndexComponent implements OnInit {
    constructor(
        private readonly ngxHelperConfirmService: NgxHelperConfirmService,
        private readonly ngxHelperContainerService: NgxHelperContainerService,
        private readonly ngxHelperCoordinatesService: NgxHelperCoordinatesService,
        private readonly ngxHelperHttpService: NgxHelperHttpService,
        private readonly ngxHelperRouteService: NgxHelperRouteService,
        private readonly ngxHelperToastService: NgxHelperToastService,
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
                ? this.ngxHelperConfirmService.status(
                      true,
                      { title: 'گزینه', value: 'مقدار' },
                      {
                          description:
                              'در صورت تایید، اطلاعات در سیستم فعال می‌شود و امکان استفاده از آنها در سایر بخش‌های سیستم وجود خواهد داشت.',
                      },
                  )
                : this.ngxHelperConfirmService.status(
                      false,
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
        const title: string = `${
            type === 'DIALOG' ? 'دیالوگ' : 'باتم‌شیت'
        } ${component} :: بررسی نمایش عنوان‌های طولانی در هدر کانتینرها`;
        const container = this.ngxHelperContainerService.init(PageIndexContainerComponent, title, { data: { component } });

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

    showCoordinates(config: boolean): void {
        this.ngxHelperCoordinatesService.show(
            { latitude: 35.6997382, longitude: 51.3380603 },
            config ? { zoom: 17, color: 'rgb(255, 0, 0)' } : {},
        );
    }

    getCoordinates(config: boolean): void {
        const get = config
            ? this.ngxHelperCoordinatesService.get(
                  { latitude: 35.6997382, longitude: 51.3380603 },
                  { zoom: 17, color: 'rgb(255, 0, 0)' },
              )
            : this.ngxHelperCoordinatesService.get({ latitude: 35.6997382, longitude: 51.3380603 });

        get.then(
            (coordinates: INgxHelperCoordinates) => console.log('COORDINATES', coordinates),
            () => {},
        );
    }

    showRoute(config: boolean): void {
        const route: NgxHelperRoute = [
            { latitude: 35.6997865, longitude: 51.3396374 },
            { latitude: 35.7004409, longitude: 51.339337 },
            { latitude: 35.7006984, longitude: 51.3385324 },
            { latitude: 35.700677, longitude: 51.3368479 },
            { latitude: 35.7003337, longitude: 51.3356892 },
            { latitude: 35.6998401, longitude: 51.3354317 },
            { latitude: 35.6991535, longitude: 51.3355605 },
            { latitude: 35.6988853, longitude: 51.3362042 },
            { latitude: 35.6987672, longitude: 51.3372342 },
            { latitude: 35.6987887, longitude: 51.3380388 },
            { latitude: 35.6989604, longitude: 51.3389079 },
            { latitude: 35.6991857, longitude: 51.3394336 },
            { latitude: 35.699647, longitude: 51.339616 },
        ];
        this.ngxHelperRouteService.show(
            route,
            config ? { zoom: 17, circle: { color: 'rgb(255, 0, 0)' }, disableAnimate: true } : {},
        );
    }

    getRoute(config: boolean): void {
        const get = config
            ? this.ngxHelperRouteService.get([{ latitude: 35.6997382, longitude: 51.3380603 }], {
                  zoom: 17,
                  circle: { color: 'rgb(255, 0, 0)' },
                  disableAnimate: true,
              })
            : this.ngxHelperRouteService.get({ view: { latitude: 35.6997382, longitude: 51.3380603 } });

        get.then(
            (route: NgxHelperRoute) => console.log('ROUTE', route),
            () => {},
        );
    }

    print(): void {
        this.ngxHelperHttpService.printPDF('http://localhost:4200/dummy.pdf');
    }

    download(type: 'PDF' | 'ZIP'): void {
        const path: string = `http://localhost:4200/dummy.${type.toLowerCase()}`;
        const title: string = `فایل ${type === 'PDF' ? 'پی‌ای‌اف' : 'زیپ'}`;
        this.ngxHelperHttpService.download(path, title);
    }

    upload(event: Event): void {
        const element: HTMLInputElement = event.target as HTMLInputElement;
        const files: FileList | null = element.files;
        if (!files || files.length === 0) return;

        const file: File | null = files.item(0);
        if (file === null) return;

        this.ngxHelperHttpService.upload<any, any>(
            file,
            'http://localhost:3100/upload/',
            { method: 'POST', body: { date: new Date() }, header: { Authorization: 'AuthorizationVALUE' } },
            (response, status) => console.log(`UPLOAD RESPONSE (${status})`, response),
            (error, status) => console.log(`UPLOAD ERROR (${status})`, error),
        );
    }

    toast(type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'): void {
        const message: string[] = [
            'نمایش نوتیفیکیشن‌ها در سایت به این صورت انجام می‌شود.',
            'نمایش خط دوم در متن نوتیفیکیشن!',
        ];
        const config: Partial<INgxHelperToastConfig> = { timeout: 5000, showClose: true };
        const onClose = () => console.log(`${type} CLOSED`);

        for (let i = 0; i < 3; i++) {
            switch (type) {
                case 'INFO':
                    this.ngxHelperToastService.info(message, config, onClose);
                    break;
                case 'SUCCESS':
                    this.ngxHelperToastService.success(message, config, onClose);
                    break;
                case 'WARNING':
                    this.ngxHelperToastService.warning(message, config, onClose);
                    break;
                case 'ERROR':
                    this.ngxHelperToastService.error(message, config, onClose);
                    break;
            }
        }
    }
}
