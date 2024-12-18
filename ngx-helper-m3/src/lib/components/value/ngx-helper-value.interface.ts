import { DateFormats, DurationFormats } from '../../pipe.types';

export type NgxHelperValue =
    | { type: 'BANK-CARD'; value?: string; view?: 'CARD' | 'BANK'; join?: string; english?: boolean }
    | { type: 'DATE'; value?: Date | number; format?: DateFormats; timezone?: string }
    | {
          type: 'DURATION';
          value?: number | Date | { from: Date } | { to: Date } | { from: Date; to: Date };
          format?: DurationFormats;
          english?: boolean;
      }
    | { type: 'FILE-SIZE'; value?: number; english?: boolean }
    | { type: 'MOBILE'; value?: string; join?: string; english?: boolean }
    | { type: 'NUMBER'; value?: number; fractionDigits?: number; english?: boolean }
    | {
          type: 'PERIOD';
          value?: Date | { from: Date } | { to: Date } | { from: Date; to: Date };
          timezone?: string;
      }
    | { type: 'PRICE'; value?: number; currency?: string; short?: boolean; english?: boolean }
    | { type: 'STRING'; value?: string; english?: boolean }
    | { type: 'VOLUME'; value?: number; short?: boolean; english?: boolean }
    | { type: 'WEIGHT'; value?: number; short?: boolean; english?: boolean };

export interface INgxHelperValueBox {
    readonly title: string;
    readonly value?: string | NgxHelperValue;
    readonly action?: () => string[] | void;
}
