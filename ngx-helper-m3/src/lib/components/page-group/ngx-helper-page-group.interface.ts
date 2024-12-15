import { InjectionToken } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

interface IPage {
    readonly title: string;
    readonly component: ComponentType<any>;
    readonly icon?: string;
}

export interface INgxHelperPageGroup {
    readonly route?: string[];
    readonly header?: ComponentType<any>;
    readonly pages: IPage[];

    // SETTING
    readonly mobileView?: boolean;
    readonly sidebarWidth?: string;
}

export const NGX_HELPER_PAGE_GROUP_DATA: InjectionToken<any> = new InjectionToken('NGX-HELPER-PAGE-GROUP-DATA');
export const NGX_HELPER_PAGE_GROUP_INDEX: InjectionToken<number> = new InjectionToken('NGX-HELPER-PAGE-GROUP-INDEX');
export const NGX_HELPER_PAGE_GROUP_TITLE: InjectionToken<string> = new InjectionToken('NGX-HELPER-PAGE-GROUP-TITLE');
