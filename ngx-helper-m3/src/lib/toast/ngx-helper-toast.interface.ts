export interface INgxHelperToastConfig {
    readonly timeout: number;
    readonly showClose: boolean;
    readonly buttons?: {
        readonly icon: string;
        readonly title: string;
        readonly action: string[] | (() => void) | (() => string[]);
    }[];
}
