export interface INgxHelperConfirm {
    readonly question: string;
    readonly description?: string;
    readonly data?: {
        readonly title: string;
        readonly value: string;
    };
    readonly icon?: string;
    readonly confirmClass?: string;
    readonly denyClass?: string;
}
