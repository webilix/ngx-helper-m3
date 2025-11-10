import {
    ApplicationRef,
    ComponentRef,
    createComponent,
    EmbeddedViewRef,
    Inject,
    Injectable,
    Injector,
    Optional,
} from '@angular/core';

import { Helper } from '@webilix/helper-library';

import { INgxHelperConfig, NGX_HELPER_CONFIG } from '../ngx-helper.config';

import { ToastComponent } from './toast/toast.component';
import { INgxHelperToastConfig } from './ngx-helper-toast.interface';

interface IToast {
    readonly icon: string;
    readonly textColor: string;
    readonly backgroundColor: string;
}

@Injectable({ providedIn: 'root' })
export class NgxHelperToastService {
    private components: { id: string; componentRef: ComponentRef<ToastComponent>; content: string }[] = [];

    constructor(
        private readonly applicationRef: ApplicationRef,
        private readonly injector: Injector,
        @Optional() @Inject(NGX_HELPER_CONFIG) private readonly config?: Partial<INgxHelperConfig>,
    ) {}

    private getId(): string {
        let id: string | undefined = undefined;
        while (!id || this.components.some((c) => c.id === id)) id = Helper.STRING.getRandom(10);

        return id;
    }

    private updatePositions(): void {
        let top: number = 0;
        this.components.forEach((c, index) => {
            c.componentRef.instance.top = `calc(${(index / 1.5).toFixed(1)}rem + calc(${top}px + 1rem))`;
            top += +c.componentRef.instance.elementRef.nativeElement.offsetHeight;
        });
    }

    toast(toast: IToast, message: string | string[]): void;
    toast(toast: IToast, message: string | string[], config: Partial<INgxHelperToastConfig>): void;
    toast(toast: IToast, message: string | string[], onClose: () => void): void;
    toast(toast: IToast, message: string | string[], config: Partial<INgxHelperToastConfig>, onClose: () => void): void;
    toast(toast: IToast, message: string | string[], arg1?: any, arg2?: any): void {
        const config: Partial<INgxHelperToastConfig> = arg2 ? arg1 : typeof arg1 === 'object' ? arg1 : {};
        const onClose: () => void = arg2 || (typeof arg1 === 'function' ? arg1 : () => {});

        const messages: string[] = typeof message === 'string' ? [message] : message;
        const content: string = [toast.icon, toast.textColor, toast.backgroundColor, ...messages].join('\n');
        const duplicate = this.components.find((component) => component.content === content);
        if (!this.config?.toastAllowDuplicates && duplicate) {
            if (this.config?.toastResetDuplicates) {
                duplicate.componentRef.instance.start = new Date().getTime();
                duplicate.componentRef.instance.progress = 0;
            }
            return;
        }

        const componentRef = createComponent<ToastComponent>(ToastComponent, {
            environmentInjector: this.applicationRef.injector,
            elementInjector: this.injector,
        });

        const id: string = this.getId();
        componentRef.instance.id = id;
        componentRef.instance.icon = toast.icon;
        componentRef.instance.textColor = toast.textColor;
        componentRef.instance.backgroundColor = toast.backgroundColor;
        componentRef.instance.messages = messages;
        componentRef.instance.config = { helper: this.config, toast: config };
        componentRef.instance.init = () => this.updatePositions();
        componentRef.instance.close = () => {
            this.applicationRef.detachView(componentRef.hostView);
            componentRef.destroy();

            this.components = this.components.filter((c) => c.id !== componentRef.instance.id);
            this.updatePositions();

            if (onClose) onClose();
        };
        const htmlElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        this.applicationRef.attachView(componentRef.hostView);
        document.body.appendChild(htmlElement);

        this.components.push({ id, componentRef, content });
        // this.updatePositions();
    }

    info(message: string | string[]): void;
    info(message: string | string[], config: Partial<INgxHelperToastConfig>): void;
    info(message: string | string[], onClose: () => void): void;
    info(message: string | string[], config: Partial<INgxHelperToastConfig>, onClose: () => void): void;
    info(message: string | string[], arg1?: any, arg2?: any): void {
        const toast: IToast = { icon: 'warning_amber', textColor: '#fff', backgroundColor: '#2f96b4' };
        this.toast(toast, message, arg1, arg2);
    }

    success(message: string | string[]): void;
    success(message: string | string[], config: Partial<INgxHelperToastConfig>): void;
    success(message: string | string[], onClose: () => void): void;
    success(message: string | string[], config: Partial<INgxHelperToastConfig>, onClose: () => void): void;
    success(message: string | string[], arg1?: any, arg2?: any): void {
        const toast: IToast = { icon: 'done_all', textColor: '#fff', backgroundColor: '#51a351' };
        this.toast(toast, message, arg1, arg2);
    }

    warning(message: string | string[]): void;
    warning(message: string | string[], config: Partial<INgxHelperToastConfig>): void;
    warning(message: string | string[], onClose: () => void): void;
    warning(message: string | string[], config: Partial<INgxHelperToastConfig>, onClose: () => void): void;
    warning(message: string | string[], arg1?: any, arg2?: any): void {
        const toast: IToast = { icon: 'info', textColor: '#fff', backgroundColor: '#f89406' };
        this.toast(toast, message, arg1, arg2);
    }

    error(message: string | string[]): void;
    error(message: string | string[], config: Partial<INgxHelperToastConfig>): void;
    error(message: string | string[], onClose: () => void): void;
    error(message: string | string[], config: Partial<INgxHelperToastConfig>, onClose: () => void): void;
    error(message: string | string[], arg1?: any, arg2?: any): void {
        const toast: IToast = { icon: 'cancel', textColor: '#fff', backgroundColor: '#bd362f' };
        this.toast(toast, message, arg1, arg2);
    }
}
