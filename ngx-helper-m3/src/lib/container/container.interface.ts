import { InjectionToken } from '@angular/core';

export interface INgxHelperContainerConfig {
    data?: any;
    padding?: string;
}

export type NgxHelperContainer = 'DIALOG' | 'BOTTOMSHEET';

export const NGX_HELPER_CONTAINER_TYPE: InjectionToken<NgxHelperContainer> = new InjectionToken('NGX-HELPER-CONTAINER-TYPE');
export const NGX_HELPER_CONTAINER_DATA: InjectionToken<any> = new InjectionToken<any>('NGX-HELPER-CONTAINER-DATA');
export const NGX_HELPER_CONTAINER_CLOSE: InjectionToken<(response?: any) => void> = new InjectionToken(
    'NGX-HELPER-CONTAINER-CLOSE',
);
