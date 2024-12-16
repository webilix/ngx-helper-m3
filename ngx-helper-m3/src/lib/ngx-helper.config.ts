import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders, Provider } from '@angular/core';

export interface INgxHelperConfig {
    readonly mobileWidth: number;

    // PAGE GROUP
    readonly pageGroupSidebarWidth: string;

    // STICKY
    readonly stickyView: {
        readonly top?: string | { readonly desktopView: string; readonly mobileView: string };
        readonly bottom?: string | { readonly desktopView: string; readonly mobileView: string };
    };
}

export const NGX_HELPER_CONFIG = new InjectionToken<Partial<INgxHelperConfig>>('NGX-HELPER-CONFIG');

export const provideNgxHelperConfig = (config: Partial<INgxHelperConfig>): EnvironmentProviders => {
    const providers: Provider[] = [{ provide: NGX_HELPER_CONFIG, useValue: config }];

    return makeEnvironmentProviders(providers);
};
