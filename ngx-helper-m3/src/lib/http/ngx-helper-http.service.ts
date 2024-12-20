import { ApplicationRef, ComponentRef, createComponent, EmbeddedViewRef, Injectable, Injector } from '@angular/core';
import { HttpStatusCode } from '@angular/common/http';

import { Helper } from '@webilix/helper-library';

import { UploadComponent } from './upload/upload.component';
import { INgxHelperHttpUploadConfig } from './ngx-helper-http.interface';

@Injectable({ providedIn: 'root' })
export class NgxHelperHttpService {
    private components: { id: string; componentRef: ComponentRef<UploadComponent<any, any>> }[] = [];

    constructor(private readonly applicationRef: ApplicationRef, private readonly injector: Injector) {}

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
}
