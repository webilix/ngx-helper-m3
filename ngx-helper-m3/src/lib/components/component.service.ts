import { Injectable } from '@angular/core';

import { INgxHelperConfig } from '../ngx-helper.config';

export interface IComponentConfig {
    readonly mobileWidth: number;
    readonly pageGroupSidebarWidth: string;
    readonly stickyView?: {
        readonly top?: { readonly desktopView: string; readonly mobileView: string };
        readonly bottom?: { readonly desktopView: string; readonly mobileView: string };
    };
}

@Injectable()
export class ComponentService {
    getComponentConfig(config?: Partial<INgxHelperConfig>): IComponentConfig {
        const getStickyView = (
            config: string | { desktopView: string; mobileView: string },
        ): { desktopView: string; mobileView: string } => {
            return {
                desktopView: typeof config === 'string' ? config : config.desktopView,
                mobileView: typeof config === 'string' ? config : config.mobileView,
            };
        };

        return {
            mobileWidth: config?.mobileWidth || 600,
            pageGroupSidebarWidth: config?.pageGroupSidebarWidth || '200px',
            stickyView: config?.stickyView
                ? {
                      top: config.stickyView.top ? getStickyView(config.stickyView.top) : undefined,
                      bottom: config.stickyView.bottom ? getStickyView(config.stickyView.bottom) : undefined,
                  }
                : undefined,
        };
    }
}
