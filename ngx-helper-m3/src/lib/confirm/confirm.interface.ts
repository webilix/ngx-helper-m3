export interface INgxHelperConfirm {
    readonly question: string;
    readonly icon?: string;
    readonly data?: {
        readonly title: string;
        readonly value: string;
    };

    // GENERAL
    readonly description?: string;
    readonly confirmClass?: string;
    readonly denyClass?: string;

    // GET DESCRIPTION
    readonly getDescription?: boolean | 'REQUIRED';
}
