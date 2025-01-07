import { Injectable } from '@angular/core';

import { INgxHelperConfig } from '../ngx-helper.config';

import { INgxHelperValue, NgxHelperValue } from './value/ngx-helper-value.interface';
import { NgxHelperValuePipe } from './value/ngx-helper-value.pipe';

export interface IComponentConfig {
    readonly mobileWidth: number;
    readonly pageGroupSidebarWidth: string;
    readonly stickyView?: {
        readonly top?: { readonly desktopView: string; readonly mobileView: string };
        readonly bottom?: { readonly desktopView: string; readonly mobileView: string };
    };
}

export interface IValueComponentData {
    readonly title: string;
    readonly value: string;
    readonly color?: string;
    readonly action?: () => string[] | void;
    readonly copyToClipboard?: boolean;
    readonly ltr?: boolean;
    readonly english?: boolean;
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

    private isRTL(value: NgxHelperValue): boolean {
        switch (value.type) {
            case 'BANK-CARD':
            case 'MOBILE':
            case 'NUMBER':
                return true;

            case 'DURATION':
                return value.format === 'FULL';
        }

        return false;
    }

    getValueData(values: INgxHelperValue[]): IValueComponentData[] {
        const pipeTransform = new NgxHelperValuePipe().transform;
        const ltrValues: NgxHelperValue['type'][] = ['BANK-CARD', 'MOBILE', 'NUMBER'];

        return values.map((item) => {
            const value = item.value;
            return value === undefined
                ? { title: item.title, value: '' }
                : typeof value === 'string'
                ? { title: item.title, value: value.trim(), color: item.color }
                : {
                      title: item.title,
                      value: pipeTransform(value),
                      color: item.color,
                      action: item.action,
                      copyToClipboard: item.copyToClipboard,
                      ltr: this.isRTL(value),
                      english: 'english' in value && !!value.english,
                  };
        });
    }
}
