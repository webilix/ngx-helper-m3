import { InjectionToken } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

interface IPage {
    readonly title: string;
    readonly icon: string;
    readonly component: ComponentType<any>;
}

export interface INgxHelperPageGroup {
    readonly route?: string[];
    readonly header?: ComponentType<any>;
    readonly pages: { [key: string]: IPage };

    // SETTING
    readonly sidebarWidth?: string;
}

export interface INgxHelperPageGroupItem {
    readonly index: number;
    readonly id: string;
    readonly title: string;
    readonly icon: string;
}

export const NGX_HELPER_PAGE_GROUP_ITEM: InjectionToken<INgxHelperPageGroupItem> = new InjectionToken(
    'NGX-HELPER-PAGE-GROUP-ITEM',
);
export const NGX_HELPER_PAGE_GROUP_DATA: InjectionToken<any> = new InjectionToken('NGX-HELPER-PAGE-GROUP-DATA');
export const NGX_HELPER_PAGE_GROUP_DATA_CHANGE: InjectionToken<(data: any) => void> = new InjectionToken(
    'NGX-HELPER-PAGE-GROUP-DATA-CHANGE',
);
