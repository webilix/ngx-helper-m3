interface ICardButton {
    readonly title: string;
    readonly icon: string;
    readonly action: () => void;
    readonly color?: string;
    readonly showIcon?: boolean;
    readonly disableOn?: () => boolean;
    readonly hideOn?: () => boolean;
}

interface ICardMenu {
    readonly title: string;
    readonly icon: string;
    readonly color?: string;
    readonly showIcon?: boolean;
    readonly buttons: (
        | 'DIVIDER'
        | {
              readonly title: string;
              readonly icon: string;
              readonly action: () => void;
              readonly color?: string;
              readonly hideIcon?: boolean;
              readonly disableOn?: () => boolean;
              readonly hideOn?: () => boolean;
          }
    )[];
    readonly disableOn?: () => boolean;
    readonly hideOn?: () => boolean;
}

export type NgxHelperCardAction = ICardButton | ICardMenu;

export interface INgxHelperCardOption {
    readonly id?: string;
    readonly icon: string;
    readonly items: ('DIVIDER' | { readonly id: string; readonly title: string })[];
    readonly action: (id: string) => void;
}
