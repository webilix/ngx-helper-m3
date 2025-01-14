interface ICardButton {
    readonly title: string;
    readonly icon: string;
    readonly action: () => void;
    readonly color?: string;
    readonly showIcon?: boolean;
}

interface ICardMenu {
    readonly title: string;
    readonly icon: string;
    readonly color?: string;
    readonly showIcon?: boolean;
    readonly buttons: ('DIVIDER' | ICardButton)[];
}

export type NgxHelperCardAction = ICardButton | ICardMenu;
