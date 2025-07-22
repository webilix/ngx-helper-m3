import { ApplicationRef, ComponentRef, createComponent, EmbeddedViewRef, Injectable, Injector } from '@angular/core';
import { HttpStatusCode } from '@angular/common/http';

import { Helper } from '@webilix/helper-library';

import { NgxHelperToastService } from '../toast/ngx-helper-toast.service';

import { DownloadComponent } from './download/download.component';
import { PdfComponent } from './pdf/pdf.component';
import { UploadComponent } from './upload/upload.component';
import { INgxHelperHttpDownloadConfig, INgxHelperHttpUploadConfig } from './ngx-helper-http.interface';

@Injectable({ providedIn: 'root' })
export class NgxHelperHttpService {
    private components: {
        id: string;
        componentRef: ComponentRef<DownloadComponent> | ComponentRef<UploadComponent<any, any>>;
    }[] = [];

    constructor(
        private readonly applicationRef: ApplicationRef,
        private readonly injector: Injector,
        private readonly ngxHelperToastService: NgxHelperToastService,
    ) {}

    private getId(): string {
        let id: string | undefined = undefined;
        while (!id || this.components.some((c) => c.id === id)) id = Helper.STRING.getRandom(10);

        return id;
    }

    private updatePositions(): void {
        this.components.forEach((c, index) => {
            c.componentRef.instance.bottom = `calc(${(index / 1.5).toFixed(1)}rem + calc(${index * 40}px + 1rem))`;
        });
    }

    private getBuffer(path: string, title: string): Promise<ArrayBuffer>;
    private getBuffer(path: string, title: string, config: Partial<INgxHelperHttpDownloadConfig>): Promise<ArrayBuffer>;
    private getBuffer(path: string, title: string, config?: Partial<INgxHelperHttpDownloadConfig>): Promise<ArrayBuffer> {
        return new Promise<ArrayBuffer>((resolve, reject) => {
            const componentRef = createComponent<DownloadComponent>(DownloadComponent, {
                environmentInjector: this.applicationRef.injector,
                elementInjector: this.injector,
            });

            const id: string = this.getId();
            componentRef.instance.id = id;
            componentRef.instance.path = path;
            componentRef.instance.title = title;
            componentRef.instance.config = config || {};
            componentRef.instance.onSuccess = (arrayBuffer: ArrayBuffer) => resolve(arrayBuffer);
            componentRef.instance.onError = () => reject();
            componentRef.instance.close = () => {
                this.applicationRef.detachView(componentRef.hostView);
                document.body.removeChild(htmlElement);
                componentRef.destroy();

                this.components = this.components.filter((c) => c.id !== componentRef.instance.id);
                this.updatePositions();
            };

            const htmlElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
            this.applicationRef.attachView(componentRef.hostView);
            document.body.appendChild(htmlElement);

            this.components.push({ id, componentRef });
            this.updatePositions();
        });
    }

    download(path: string, title: string): void;
    download(path: string, title: string, config: Partial<INgxHelperHttpDownloadConfig>): void;
    download(path: string, title: string, config?: Partial<INgxHelperHttpDownloadConfig>): void {
        const onError = () => this.ngxHelperToastService.error('امکان دانلود فایل وجود ندارد.');
        const onSuccess = (arrayBuffer: ArrayBuffer) => {
            try {
                const split: string[] = path
                    .split('.')
                    .map((text: string) => text.trim().replace(/\//gi, ''))
                    .filter((text: string) => !!text);
                const name: string = Helper.STRING.getFileName(title, split[split.length - 1] || '');

                const href: string = URL.createObjectURL(new Blob([arrayBuffer]));
                const a: HTMLAnchorElement = document.createElement('a');
                a.href = href;
                a.download = name;
                a.click();
            } catch (e) {
                onError();
            }
        };

        this.getBuffer(path, title, config || {}).then(onSuccess, onError);
    }

    upload<R, E>(
        file: File,
        url: string,
        onSuccess: (response: R | undefined, status: HttpStatusCode) => void,
        onError: (error: E | undefined, status: HttpStatusCode) => void,
    ): void;
    upload<R, E>(
        file: File,
        url: string,
        config: Partial<INgxHelperHttpUploadConfig>,
        onSuccess: (response: R, status: HttpStatusCode) => void,
        onError: (error: E, status: HttpStatusCode) => void,
    ): void;
    upload<R, E>(file: File, url: string, arg1: any, arg2: any, arg3?: any): void {
        const config: Partial<INgxHelperHttpUploadConfig> = typeof arg3 === 'function' ? arg1 : {};
        const onSuccess: (response: R, status: HttpStatusCode) => void = typeof arg3 === 'function' ? arg2 : arg1;
        const onError: (error: E, status: HttpStatusCode) => void = typeof arg3 === 'function' ? arg3 : arg2;

        const componentRef = createComponent<UploadComponent<R, E>>(UploadComponent, {
            environmentInjector: this.applicationRef.injector,
            elementInjector: this.injector,
        });

        const id: string = this.getId();
        componentRef.instance.id = id;
        componentRef.instance.file = file;
        componentRef.instance.url = url;
        componentRef.instance.config = config;
        componentRef.instance.close = (type: 'RESPONSE' | 'ERROR', result: any, status: HttpStatusCode) => {
            this.applicationRef.detachView(componentRef.hostView);
            document.body.removeChild(htmlElement);
            componentRef.destroy();

            this.components = this.components.filter((c) => c.id !== componentRef.instance.id);
            this.updatePositions();

            switch (type) {
                case 'RESPONSE':
                    onSuccess(result || undefined, status);
                    break;
                case 'ERROR':
                    onError(result || undefined, status);
                    break;
            }
        };

        const htmlElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        this.applicationRef.attachView(componentRef.hostView);
        document.body.appendChild(htmlElement);

        this.components.push({ id, componentRef });
        this.updatePositions();
    }

    //#region PDF
    getPDF = (data: string | ArrayBuffer | Blob, config?: Partial<INgxHelperHttpDownloadConfig>): Promise<Blob> => {
        return new Promise<Blob>((resolve, reject) => {
            if (typeof data !== 'string') {
                resolve(new Blob([data], { type: 'application/pdf' }));
                return;
            }

            this.getBuffer(data, 'دریافت فایل', config || {}).then(
                (arrayBuffer: ArrayBuffer) => resolve(new Blob([arrayBuffer], { type: 'application/pdf' })),
                () => reject(),
            );
        });
    };

    showPDF(url: string): void;
    showPDF(url: string, config: Partial<INgxHelperHttpDownloadConfig>): void;
    showPDF(buffer: ArrayBuffer): void;
    showPDF(buffer: ArrayBuffer, config: Partial<INgxHelperHttpDownloadConfig>): void;
    showPDF(blob: Blob): void;
    showPDF(blob: Blob, config: Partial<INgxHelperHttpDownloadConfig>): void;
    showPDF(data: string | ArrayBuffer | Blob, config?: Partial<INgxHelperHttpDownloadConfig>): void {
        this.getPDF(data, config).then(async (blob: Blob) => {
            const componentRef = createComponent<PdfComponent>(PdfComponent, {
                environmentInjector: this.applicationRef.injector,
                elementInjector: this.injector,
            });

            componentRef.instance.src = blob;
            componentRef.instance.close = () => {
                this.applicationRef.detachView(componentRef.hostView);
                document.body.removeChild(htmlElement);
                componentRef.destroy();
                document.body.style.overflow = 'visible';
            };

            const htmlElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
            this.applicationRef.attachView(componentRef.hostView);
            document.body.appendChild(htmlElement);
            document.body.style.overflow = 'hidden';
        });
    }

    printPDF(url: string): void;
    printPDF(url: string, config: Partial<INgxHelperHttpDownloadConfig>): void;
    printPDF(buffer: ArrayBuffer): void;
    printPDF(buffer: ArrayBuffer, config: Partial<INgxHelperHttpDownloadConfig>): void;
    printPDF(blob: Blob): void;
    printPDF(blob: Blob, config: Partial<INgxHelperHttpDownloadConfig>): void;
    printPDF(data: string | ArrayBuffer | Blob, config?: Partial<INgxHelperHttpDownloadConfig>): void {
        this.getPDF(data, config).then(
            (blob: Blob) => {
                try {
                    const prevIframe = document.getElementById('ngx-helper-http-pdf-download-iframe');
                    if (prevIframe) document.body.removeChild(prevIframe);

                    const src: string = URL.createObjectURL(blob);
                    const iframe: HTMLIFrameElement = document.createElement('iframe');
                    iframe.id = 'ngx-helper-http-pdf-download-iframe';
                    iframe.style.display = 'none';
                    document.body.appendChild(iframe);

                    iframe.src = src;
                    iframe.onload = () => iframe.contentWindow?.print();
                } catch (e) {
                    this.ngxHelperToastService.error('امکان پرینت فایل وجود ندارد.');
                }
            },
            () => this.ngxHelperToastService.error('امکان دانلود فایل وجود ندارد.'),
        );
    }
    //#endregion
}
